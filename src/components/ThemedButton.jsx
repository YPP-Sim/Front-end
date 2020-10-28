import React from "react";
import styled from "styled-components";
import Button from "./Forms/SubmitButton";
import Values from "values.js";

const Root = styled(Button)`
  box-shadow: none;
  height: 50px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : props.theme.accentColor};
  color: #303030;
  user-select: none;
  &:hover {
    background-color: ${(props) =>
      props.backgroundColor
        ? new Values(props.backgroundColor).shade(30).hexString()
        : props.theme.accentHover};
  }
`;

const ThemedButton = (props) => {
  return <Root {...props}>{props.children}</Root>;
};

export default ThemedButton;
