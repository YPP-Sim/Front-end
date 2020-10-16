import React from "react";
import styled from "styled-components";

const Root = styled.p`
    font-size: 16px;
    margin: 0;
    padding: 0;
    color: #333;
    margin-bottom: 10px;
    font-family: ${({theme}) => theme.textFont};
    `;

const FormText = ({children}) => {
return <Root>{children}</Root>;
};

export default FormText;
