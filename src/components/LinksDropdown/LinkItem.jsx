import React from "react";
import styled from "styled-components";

const Root = styled.div`
    padding: 15px 0px;
    width: 140px;
    font-size: 15px;
    font-family: ${({theme}) => theme.textFont};
    color: ${({theme}) => theme.textColor};
    margin: 0;
    text-align: left;

    cursor: pointer;
    user-select: none;
    &:hover {
        background-color: ${({theme}) => theme.accentColor};
    }
`;


const LinkItem = (props) => {
return <Root {...props}>{props.children}</Root>;
};

export default LinkItem;
