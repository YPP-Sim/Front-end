import React from "react";
import styled from "styled-components";
import RegisterForm from "./RegisterForm";

const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
`;


const RegisterPage = () => {
  return <Root>
      <RegisterForm />
  </Root>;
};

export default RegisterPage;
