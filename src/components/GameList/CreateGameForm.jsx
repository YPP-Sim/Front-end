import React, { useState, useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import styled, { keyframes } from "styled-components";
import InputField from "../InputField";
import Button from "../Button";
import axios from "../../axios-config";
import GlobalLoader from "../loaders/GlobalLoader";
import { useHistory } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import origAxios from "axios";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  to {
    opacity: 1;
    transform: translateY(-50%, -50%) scale(1);
  }
`;

const Root = styled.div`
  position: fixed;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 493px;
  max-height: 450px;
  width: 100%;
  height: 100%;

  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background: #333a42;
  border-radius: 20px;

  padding: 27px 42px;

  box-sizing: border-box;

  animation: ${slideIn} 0.46s cubic-bezier(0.33, 0.41, 0.35, 1.5);
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.textFont};
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  font-size: 24px;
  margin: 0;
  font-weight: 500;
`;

const FormContainer = styled.div`
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InputLabel = styled.label`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;

  color: #ffffff;

  margin-right: ${(props) => props.mr || "29px"};
  font-family: ${({ theme }) => theme.textFont};

  color: ${({ theme }) => theme.textColor};
`;

const SelectField = styled.select`
  border: none;

  border-radius: 3px;
  height: 35px;

  font-size: 16px;
  font-family: ${({ theme }) => theme.textFont};

  padding: 5px 10px;
  color: ${(props) => props.color || "#535353"};
  background-color: ${(props) => props.backgroundColor || "#eee"};
  outline: none;

  min-width: 188px;
  width: 250px;
  padding: 0px 10px;
  box-sizing: border-box;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const CreateGameForm = (props) => {
  const history = useHistory();
  const { playerName, setPlayerName } = useContext(PlayerContext);
  const [formData, setFormData] = useState({
    roomName: "",
    maxPlayers: 6,
    mapName: "",
    password: "",
    userName: "",
  });
  const [cancelToken, setCancelToken] = useState(
    origAxios.CancelToken.source()
  );
  const [availableMaps, setAvailableMaps] = useState([]);
  const [roomNameError, setRoomNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/maps", {
        cancelToken: cancelToken.token,
      })
      .then((res) => {
        setFormData({ ...formData, mapName: res.data[0] });
        setAvailableMaps(res.data);
      })
      .catch((err) => {
        if (origAxios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else console.error(err.response);
      });

    return () => {
      cancelToken.cancel(
        "Request cancelled because the CreateGameForm component unmounted"
      );
    };
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const { roomName, mapName, maxPlayers, password } = formData;
    const body = {
      id: roomName,
      maxPlayers,
      mapName,
      locked: password.length > 0,
      password,
      gameOwner: playerName,
    };

    setLoading(true);

    axios
      .post("/games/create-game", body)
      .then(() => {
        props.onClose();
        return axios.post("/games/join-game-request", {
          gameId: roomName,
          requestedPlayerName: playerName,
          password,
        });
      })
      .then((response) => {
        // setLoading(false);
        sessionStorage.setItem("token", response.data.token);
        history.push(`/games/${roomName}`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.message === "Network Error") {
          console.log("Should display 'server down/network error' message");
          return;
        }
        if (err.response && err.response.status === 409) setRoomNameError(true);
      });
  };

  const handleUsernameChange = (e) => {
    setPlayerName(e.target.value);
  };

  if (loading) {
    return (
      <Root>
        <GlobalLoader />
      </Root>
    );
  }

  return (
    <Root>
      <Title>Create New Game</Title>
      <FormContainer>
        <InputContainer>
          <InputLabel htmlFor="userName">User name: </InputLabel>
          <InputField
            name="userName"
            id="userName"
            onChange={handleUsernameChange}
            value={playerName}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel htmlFor="roomName">Room name: </InputLabel>
          <InputField
            name="roomName"
            error={roomNameError}
            id="roomName"
            onChange={handleFormChange}
            value={formData.roomName}
          />
        </InputContainer>
        {roomNameError && <ErrorMessage>Room name already in use</ErrorMessage>}
        <InputContainer>
          <InputLabel htmlFor="maxPlayers">Max players: </InputLabel>
          <InputField
            name="maxPlayers"
            id="maxPlayers"
            type="number"
            onChange={handleFormChange}
            value={formData.maxPlayers}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel htmlFor="mapName">Map: </InputLabel>
          <SelectField
            name="mapName"
            id="mapName"
            value={formData.mapName}
            onChange={handleFormChange}
          >
            {availableMaps.map((map, key) => (
              <option key={key}>{map}</option>
            ))}
          </SelectField>
        </InputContainer>

        <InputContainer>
          <InputLabel mr="10px" htmlFor="password">
            Set password:
          </InputLabel>
          <InputField
            name="password"
            id="password"
            value={formData.password}
            placeholder="(optional)"
            onChange={handleFormChange}
          />
        </InputContainer>
      </FormContainer>
      <ButtonsContainer>
        <Button
          height="40px"
          fontSize="18px"
          width="180px"
          onClick={handleCreate}
          noShadow
        >
          Create Game
        </Button>
        <Button
          height="40px"
          width="180px"
          fontSize="18px"
          color="#FFFFFF"
          backgroundColor="#C4C4C43F"
          noShadow
          onClick={props.onClose}
        >
          Cancel
        </Button>
      </ButtonsContainer>
    </Root>
  );
};

export default CreateGameForm;
