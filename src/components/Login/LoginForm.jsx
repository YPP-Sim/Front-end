import React, {useState} from "react";
import styled, {keyframes} from "styled-components";
import LoginField from "./LoginField";

const popup = keyframes`
    from {
        transform: translateY(200px);
        opacity: 0;
    }

    to {
        transform: transateY(0px);
        opacity: 1;
    }
`;


const Root = styled.div`
width: 100%;
min-width: 300px;
max-width: 420px;
height: 525px;
box-sizing: border-box;
background: #fff;
border-radius: 5px;
box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.15);
animation: ${popup} 0.4s ease-out;
`;

const FormContainer = styled.form`
    width: 100%;
    height: 100%;
    margin-top: 20px;
    padding: 40px;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const LoginButton = styled.button`
    outline: none;
    height: 60px;
    border: 0;
    border-radius: 4px;
    background-color: #1e1e1e;
    width: 100%;
    color: #ccc;
    font-family: ${(({theme}) => theme.textFont)} sans-serif;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 50px;
    font-size: 18px;
    box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.07);
    transition: background-color 0.1s ease-out;

    &:hover {
        background-color: #000;
    }

`;

const Title = styled.h2`
font-size: 25px;
margin: 0;
padding: 0;
margin-bottom: 50px;
color: #333;
font-family: "Oxygen" sans-serif;
`;

const LoginForm = () => {
    const [formData, setFormData] = useState({username: "", password: ""});

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitted!");
    }

  return <Root>
      <FormContainer onSubmit={handleSubmit}>
          <Title>YPP-SIM</Title>
            <LoginField label="Username" type="text" name="username" id="username" value={formData.username} onChange={handleFormChange} />
            <LoginField label="Password" type="password" name="password" id="password" value={formData.password}  onChange={handleFormChange}/>
            <LoginButton>Login</LoginButton>
      </FormContainer>

  </Root>;
};

export default LoginForm;
