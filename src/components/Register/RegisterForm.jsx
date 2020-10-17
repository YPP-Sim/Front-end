import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import popup from "../../styled-animations/popup";
import Form from "../Forms/Form";
import Title from "../Forms/Title";
import InputField from "../Forms/InputField";
import SubmitButton from "../Forms/SubmitButton";
import ErrorMessage from "../Forms/ErrorMessage";
import FormText from "../Forms/FormText";
import GlobalLoader from "../loaders/GlobalLoader";
import axiosAuth from "../../axios-config";

const Root = styled.div`
    width: 100%;
    min-width: 300px;
    max-width: 420px;
    height: 100%;
    min-height: 300px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.15);
    animation: ${popup} 0.4s ease-out;
`;

const LoginLink = styled(Link)`
    text-decoration: none;
    color: ${({theme}) => theme.accentColor};
    margin-bottom: 3px;
`;

const CenterContainer = styled.div`
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
`;

const initialErrorData = {
    usernameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
}

const RegisterForm = () => {
    const [formData, setFormData] = useState({username: "", email: "", password: "", confirmPassword: ""});
    
    const [usernameError, setUsernameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
  
    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const checkAndHandlePasswords = () => {
        if(formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return false;
        }

        return true;
    }

    const clearErrors = () => {
        setEmailError(null);
        setUsernameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
    }
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // Clear out any errors if we're resubmitting
        clearErrors();

        if(!checkAndHandlePasswords()) return;
        setLoading(true);

        axiosAuth.post("/auth/register", {username: formData.username, email: formData.email, password: formData.password})
        .then(() => {
            setSuccess(true);
        })
        .catch(err => {
            console.log(err.response);

            if(err.response.data.errors) {
                for(let errObj of err.response.data.errors) {
                    if(errObj.param === "password") setPasswordError(errObj.msg);
                    else if(errObj.param === "username") setUsernameError(errObj.msg);
                    else if(errObj.param === "email") setEmailError(errObj.msg);
                }
            }

            if(err.response.data.usernameError) {
                setUsernameError(err.response.data.usernameError);
            }
            if(err.response.data.emailError) {
                setEmailError(err.response.data.emailError);
            }
            if(err.response.data.passwordError) {
                setPasswordError(err.response.data.passwordError);
            }
            
        })
        .finally(() => {
            setLoading(false);
        })
    }

    if(loading) {
        return <Root>
            <CenterContainer>
                <GlobalLoader color="#242424"/>
            </CenterContainer>
        </Root>
    }

    if(success) {
        return <Root>
            <CenterContainer>

                <Title>Account Created</Title>
                <FormText>Hooray!</FormText>
                <LoginLink to="/login">Login Here</LoginLink>
            </CenterContainer>
        </Root>
    }

    return <Root>
        <Form onSubmit={handleSubmit}>
            <Title>Create Your Account</Title>
            <InputField label="Username" type="text" name="username" id="username" value={formData.username} onChange={handleFormChange} />
            {usernameError && (
                <ErrorMessage>{usernameError}</ErrorMessage>
            )}
            <InputField label="Email" type="email" name="email" id="email" value={formData.email} onChange={handleFormChange} />
            {emailError && (
                <ErrorMessage>{emailError}</ErrorMessage>
            )}
            <InputField label="Password" type="password" name="password" id="password" value={formData.password} onChange={handleFormChange} />
            {passwordError && (
                <ErrorMessage>{passwordError}</ErrorMessage>
            )}
            <InputField label="Confirm Password" type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} />
            {confirmPasswordError && (
                <ErrorMessage>{confirmPasswordError}</ErrorMessage>
            )}
            <SubmitButton>Register</SubmitButton>
            <FormText>Already have an account?</FormText>
            <LoginLink to="/login">Login Here</LoginLink>
        </Form>
    </Root>;
};

export default RegisterForm;
