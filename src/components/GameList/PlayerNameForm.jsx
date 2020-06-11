import React, { useState, useContext } from "react";
import styled from "styled-components";
import PlayerContext from "../../contexts/PlayerContext";
import Button from "../Button";
import InputField from "../InputField";

const Root = styled.div`
  position: fixed;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 500px;
  max-height: 250px;
  width: 100%;
  height: 100%;

  border-radius: 8px;
  background-color: white;
  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  font-weight: 500;
`;

const InputLabel = styled.label`
  font-size: 16px;
  width: 100%;

  margin-bottom: 5px;
  margin-left: 5px;
  font-family: ${({ theme }) => theme.textFont};

  color: ${({ theme }) => theme.textColor};
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const SubmitButton = styled(Button)`
  border-radius: 0px;
  height: 70px;
`;

const PlayerNameForm = () => {
  const [inputValue, setInputValue] = useState("");
  const { setPlayerName } = useContext(PlayerContext);

  const handleSubmit = () => {
    setPlayerName(inputValue);
  };

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Root>
      <Title>Set Display Name</Title>
      <CenterContainer>
        <InputLabel htmlFor="nameInput">Display Name:</InputLabel>
        <InputField
          id="nameInput"
          type="text"
          placeholder="John Doe"
          value={inputValue}
          onChange={onInputChange}
        />
      </CenterContainer>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Root>
  );
};

export default PlayerNameForm;
