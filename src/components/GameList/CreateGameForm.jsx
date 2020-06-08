import React, { useState } from "react";
import styled from "styled-components";
import InputField from "../InputField";
import Button from "../Button";

const Root = styled.div`
  position: fixed;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 600px;
  max-height: 400px;
  width: 100%;
  height: 100%;

  border-radius: 8px;
  background-color: white;
  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  font-weight: 500;
`;

const FormContainer = styled.div``;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-right: 9px;
  font-family: ${({ theme }) => theme.textFont};

  color: ${({ theme }) => theme.textColor};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CreateGameForm = () => {
  const [formData, setFormData] = useState({
    roomName: "",
    maxPlayers: 0,
    mapName: "",
    password: "",
  });
  const [locked, setLocked] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Root>
      <Title>Create New Game</Title>
      <FormContainer>
        <InputContainer>
          <InputLabel>Room Name: </InputLabel>
          <InputField
            name="roomName"
            placeholder="Room Name"
            onChange={handleFormChange}
            value={formData.roomName}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Max Players: </InputLabel>
          <InputField
            name="maxPlayers"
            type="number"
            placeholder="Max Players"
            onChange={handleFormChange}
            value={formData.maxPlayers}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>Map Name: </InputLabel>
          <InputField
            name="mapName"
            type="text"
            value={formData.mapName}
            placeholder="Map Name"
            onChange={handleFormChange}
          />
        </InputContainer>

        <InputContainer>
          <InputLabel>Locked: </InputLabel>
          <InputField
            type="checkbox"
            onChange={() => setLocked(!locked)}
            name="locked"
            placeholder="Locked"
            checked={locked}
          />
        </InputContainer>

        {locked && (
          <InputContainer>
            <InputLabel>Password: </InputLabel>
            <InputField
              name="password"
              type="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleFormChange}
            />
          </InputContainer>
        )}
      </FormContainer>
      <ButtonsContainer>
        <Button height="45px" margin="0px 10px 10px 10px">
          Create Game
        </Button>
        <Button
          height="45px"
          backgroundColor="#D65252"
          margin="0px 10px 0px 10px"
        >
          Cancel
        </Button>
      </ButtonsContainer>
    </Root>
  );
};

export default CreateGameForm;
