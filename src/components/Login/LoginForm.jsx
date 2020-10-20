import React, {useState, useContext} from "react";
import styled from "styled-components";
import GlobalLoader from "../loaders/GlobalLoader";
import axiosAuth from "../../axios-config";
import UserContext  from "../../contexts/UserContext";
import {setAccessToken, setRefreshToken} from "../../util/TokenStorage";
import {useHistory, Link} from "react-router-dom";
import InputField from "../Forms/InputField";
import ErrorMessage from "../Forms/ErrorMessage";
import Title from "../Forms/Title";
import Form from "../Forms/Form";
import SubmitButton from "../Forms/SubmitButton";
import FormText from "../Forms/FormText";

const Root = styled.div`
    width: 100%;
    min-width: 300px;
    max-width: 420px;
    height: 500px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.15);
`;

const RegisterLink = styled(Link)`
    text-decoration: none;
    color: ${({theme}) => theme.accentColor};
    margin-bottom: 3px;
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
            console.log(err);
            if(err.response)
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
            <Form>
                <Title loading="true">Logging In</Title>
                <GlobalLoader color="#242424"/>
            </Form>
        </Root>
    }

  return <Root>
      <Form onSubmit={handleSubmit}>
          <Title>YPP-SIM</Title>
            <InputField label="Username" type="text" name="username" id="username" value={formData.username} onChange={handleFormChange} />
            {errorData.usernameError && (
                <ErrorMessage>{errorData.usernameError}</ErrorMessage>
            )}
            <InputField label="Password" type="password" name="password" id="password" value={formData.password}  onChange={handleFormChange}/>
            {errorData.passwordError && (
                <ErrorMessage>{errorData.passwordError}</ErrorMessage>
            )}
            <SubmitButton>Login</SubmitButton>

            <FormText>Don't have an account?</FormText>
            <RegisterLink to="/register">Register here</RegisterLink>
      </Form>

  </Root>;
};

export default LoginForm;
