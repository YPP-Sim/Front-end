import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import styled from "styled-components";
import popup from "../../styled-animations/popup";
import Form from "../Forms/Form";
import Title from "../Forms/Title";
import InputField from "../Forms/InputField";
import SubmitButton from "../Forms/SubmitButton";
import FormText from "../Forms/FormText";
import { Global } from "@emotion/core";
import GlobalLoader from "../loaders/GlobalLoader";

const Root = styled.div`
    width: 100%;
    min-width: 300px;
    max-width: 420px;
    height: 680px;
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

const initialErrorData = {
    usernameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
}

const RegisterForm = () => {
    const [formData, setFormData] = useState({username: "", email: "", password: "", confirmPassword: ""});
    const [errorData, setErrorData] = useState(initialErrorData);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
  
    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
    }

    if(loading) {
        return <Root>
            <Form>
                <GlobalLoader color="#242424"/>
            </Form>
        </Root>
    }

    return <Root>
        <Form onSubmit={handleSubmit}>
            <Title>Create Your Account</Title>
            <InputField label="Username" type="text" name="username" id="username" value={formData.username} onChange={handleFormChange} />
            <InputField label="Email" type="email" name="email" id="email" value={formData.email} onChange={handleFormChange} />
            <InputField label="Password" type="password" name="password" id="password" value={formData.password} onChange={handleFormChange} />
            <InputField label="Confirm Password" type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} />

            <SubmitButton>Register</SubmitButton>
            <FormText>Already have an account?</FormText>
            <LoginLink to="/login">Login Here</LoginLink>
        </Form>
    </Root>;
};

export default RegisterForm;
