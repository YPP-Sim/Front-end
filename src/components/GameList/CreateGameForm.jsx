import React from "react";
import styled from "styled-components";

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
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  font-weight: 500;
`;

const CreateGameForm = () => {
  return (
    <Root>
      <Title>Create New Game</Title>
    </Root>
  );
};

export default CreateGameForm;
