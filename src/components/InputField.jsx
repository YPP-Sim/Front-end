import React from "react";
import styled from "styled-components";

const Root = styled.input`
  border: none;
  background: #f2f2f2;
  border-radius: 2px;
  height: ${(props) => props.height || "35px"};

  font-size: 14px;
  font-family: ${({ theme }) => theme.textFont};

  padding: 0px 10px;
  color: ${(props) => props.color || "#535353"};

  outline: none;

  width: ${(props) => props.width || "250px"};
  box-sizing: border-box;

  margin-bottom: ${(props) => props.mb};
  margin-top: ${(props) => props.mt};
`;

const InputField = (props) => {
  return <Root {...props}></Root>;
};

export default InputField;
