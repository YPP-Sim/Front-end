import React, {useState, useContext} from "react";
import styled, {keyframes} from "styled-components";
import GlobalLoader from "../loaders/GlobalLoader";
import axiosAuth from "../../axios-config";
import LoginField from "./LoginField";
import UserContext  from "../../contexts/UserContext";
import {setAccessToken, setRefreshToken} from "../../util/TokenStorage";
import {useHistory} from "react-router-dom";


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
height: 500px;
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
margin-bottom: ${(props) => props.loading ? "0px" : "50px"};
color: #333;
font-family: "Oxygen" sans-serif;
`;

const ErrorMessage = styled.p`
    text-align: left;
    width: 100%;
    color: red;
    font-size: 16px;
    font-family: ${({theme}) => theme.textFont};
    margin: 0;
    padding: 0;
    margin-left: 10px;

    transform: translateY(-20px);
`;

const LoginForm = () => {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [errorData, setErrorData] = useState({usernameError: null, passwordError: null});
    const [loading, setLoading] = useState(false);
    const { setUserData } = useContext(UserContext);
    const history = useHistory();


    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorData({usernameError: null, passwordError: null});
        axiosAuth.post("/auth/login", {username: formData.username, password: formData.password})
        .then((res) => {
            setUserData({username: formData.username, loggedIn: true});
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setLoading(false);
            history.push("/");
        })
        .catch(err => {
            console.log(err.response);
            if(err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                for(let error of errors) {
                    setErrorData({...errorData, [error.param + "Error"]: error.msg})
                }
            } else if(err.response.data.usernameError) {
                setErrorData({...errorData, usernameError: err.response.data.usernameError});
            } else if(err.response.data.passwordError) {
                setErrorData({...errorData, passwordError: err.response.data.passwordError});
            }
            setLoading(false);
        });
    }

    if(loading) {
        return <Root>
            <FormContainer>
                <Title loading="true">Logging In</Title>
                <GlobalLoader color="#242424"/>
            </FormContainer>
        </Root>
    }

  return <Root>
      <FormContainer onSubmit={handleSubmit}>
          <Title>YPP-SIM</Title>
            <LoginField label="Username" type="text" name="username" id="username" value={formData.username} onChange={handleFormChange} />
            {errorData.usernameError && (
                <ErrorMessage>{errorData.usernameError}</ErrorMessage>
            )}
            <LoginField label="Password" type="password" name="password" id="password" value={formData.password}  onChange={handleFormChange}/>
            {errorData.passwordError && (
                <ErrorMessage>{errorData.passwordError}</ErrorMessage>
            )}
            <LoginButton>Login</LoginButton>
      </FormContainer>

  </Root>;
};

export default LoginForm;
