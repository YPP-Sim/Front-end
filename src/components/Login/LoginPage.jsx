import React from "react";
import styled from "styled-components";
import LoginForm from "./LoginForm";

const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
`;


const LoginPage = () => {
  return <Root>
        <LoginForm /> 
  </Root>;
};

export default LoginPage;
