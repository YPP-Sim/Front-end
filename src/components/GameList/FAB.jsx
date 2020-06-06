import React from "react";
import styled from "styled-components";

const Root = styled.button`
  position: fixed;
  bottom: ${(props) => props.bottom || "50px"};
  width: ${(props) => props.width || "70px"};
  height: ${(props) => props.height || "70px"};
  background-color: ${(props) => props.backgroundColor || "#222"};

  border-radius: 100%;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(props) => props.color || "#fff"};
  font-family ${(props) => props.fontFamily || props.theme.titleFont};
    text-align: center;

    cursor: pointer;
    transition: all .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;
    
    &: hover {
        box-shadow: 0 5px 5px -3px rgba(0,0,0,0.25),
        0 8px 10px 1px rgba(9,0,0,0.21),
        0 3px 14px 2px rgba(0,0,0,0.19);

        background-color: #000;
    }

    outline: none;
    text-decoration: none;
    border: none;
`;

const FAB = ({ onClick, children }) => {
  return <Root onClick={onClick}>{children}</Root>;
};

export default FAB;
