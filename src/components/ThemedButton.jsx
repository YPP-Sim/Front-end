import React from "react";
import styled from "styled-components";
import Button from "./Forms/SubmitButton";

const Root = styled(Button)`
    box-shadow: none;
    height: 50px;
    background-color: ${({theme}) => theme.accentColor};
    color: #303030;

    &:hover {
        background-color: ${({theme}) => theme.accentHover};
    }
`;

const ThemedButton = (props) => {
return <Root {...props}>{props.children}</Root>;
};

export default ThemedButton;
