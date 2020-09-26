import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import InputField from "../InputField";
import PlayerContext from "../../contexts/PlayerContext";
import closeIconImg from "../../SVGs/close_icon.svg";
import ErrorMessage from "../ErrorMessage";
import Button from "../Button";
import GlobalLoader from "../loaders/GlobalLoader";

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
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const elem = document.getElementById("userName");
    if (elem) elem.focus();
  }, []);

  const handleEnterKeyDown = (event) => {
    if (event.key === "Enter") {
      // Click button
      const btnElem = document.querySelector("#joinButton");
      if (btnElem) btnElem.click();
    }
  };

  const handleButtonClick = async () => {
    // Reset form errors
    setPasswordError(false);
    setUsernameError(false);

    setLoading(true);
    setDefaultName(playerName);
    const errData = await onJoin(gameId, password);
    if (errData) {
      if (errData.usernameError) setUsernameError(errData.usernameError);
      if (errData.passwordError) setPasswordError(errData.passwordError);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Root>
        <GlobalLoader />
      </Root>
    );

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
        error={usernameError}
        value={playerName}
        onKeyDown={handleEnterKeyDown}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
      {hasPassword && (
        <React.Fragment>
          <InputLabel htmlFor="password">Password:</InputLabel>
          <InputField
            width="100%"
            mb="26px"
            error={passwordError}
            mt="8px"
            name="password"
            id="password"
            onKeyDown={handleEnterKeyDown}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </React.Fragment>
      )}
      {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

      <Button
        id="joinButton"
        noShadow
        fontSize="18px"
        onClick={handleButtonClick}
      >
        Join game
      </Button>
    </Root>
  );
};

export default ChooseUsernameForm;
