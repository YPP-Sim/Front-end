import React from "react";
import styled from "styled-components";

const Root = styled.h2`
    margin: 0;
    padding: 0;
    font-family: ${({theme}) => theme.textFont};
    color: ${({theme}) => theme.textColor};

    font-size: 26px;
    text-align: center;

    margin-bottom: 25px;
`;

const ViewTitle = ({children}) => {
return <Root>{children}</Root>;
};

export default ViewTitle;
