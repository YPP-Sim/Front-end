import React from "react";
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
  //   box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
  //     0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
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
  width: 50%;
  margin-bottom: 10px;
`;

const CreateGameForm = () => {
  return (
    <Root>
      <Title>Create New Game</Title>
      <FormContainer>
        <InputField></InputField>
      </FormContainer>
      <ButtonsContainer>
        <Button margin="0px 10px 0px 0px">Create Game</Button>
        <Button backgroundColor="#D65252" margin="0px 0px 0px 10px">
          Cancel
        </Button>
      </ButtonsContainer>
    </Root>
  );
};

export default CreateGameForm;
