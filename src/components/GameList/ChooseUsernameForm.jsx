import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import InputField from "../InputField";
import PlayerContext from "../../contexts/PlayerContext";
import closeIconImg from "../../SVGs/close_icon.svg";
import Button from "../Button";

const Root = styled.div`
  position: fixed;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  max-width: 362px;
  width: 100%;
  min-height: min-content;
  max-height: min-content;
  background: #333a42;
  border-radius: 20px;
  padding: 42px;
  box-sizing: border-box;

  cursor: default;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.textColor};
  font-family: ${({ theme }) => theme.textFont};
  font-size: 24px;
  font-weight: 500;
  line-height: 35px;
  text-align: center;
  margin: 0;
  padding: 0;

  margin-bottom: 26px;
`;

const CloseIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const IconContainer = styled.div`
  position: absolute;

  top: 16px;
  right: 16px;

  cursor: pointer;
`;

const InputLabel = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;

  font-family: ${({ theme }) => theme.textFont};

  color: ${({ theme }) => theme.textColor};
`;

const ChooseUsernameForm = ({ onJoin, hasPassword, gameId, onClose }) => {
  const { playerName, setPlayerName, setDefaultName } = useContext(
    PlayerContext
  );
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.getElementById("userName").focus();
  }, []);

  const handleButtonClick = () => {
    setDefaultName(playerName);
    onJoin(gameId, password);
  };

  return (
    <Root>
      <IconContainer onClick={onClose}>
        <CloseIcon src={closeIconImg} />
      </IconContainer>
      <Title>Choose user name</Title>
      <InputLabel htmlFor="userName">User name:</InputLabel>
      <InputField
        width="100%"
        mb="26px"
        mt="8px"
        name="userName"
        id="userName"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      {hasPassword && (
        <React.Fragment>
          <InputLabel htmlFor="password">Password:</InputLabel>
          <InputField
            width="100%"
            mb="26px"
            mt="8px"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </React.Fragment>
      )}

      <Button noShadow fontSize="18px" onClick={handleButtonClick}>
        Join game
      </Button>
    </Root>
  );
};

export default ChooseUsernameForm;
