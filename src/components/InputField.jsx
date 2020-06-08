import React from "react";
import styled from "styled-components";

const Root = styled.input`
  border: none;

  border-radius: 3px;
  height: ${(props) => props.height || "30px"};

  font-size: 16px;
  font-family: ${({ theme }) => theme.textFont};

  padding: 5px 10px;
  color: ${(props) => props.color || "#535353"};
  background-color: ${(props) => props.backgroundColor || "#eee"};

  outline: none;
`;

const InputField = (props) => {
  return <Root {...props}></Root>;
};

export default InputField;
