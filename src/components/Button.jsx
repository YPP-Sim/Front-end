import React from "react";

import styled from "styled-components";
import Values from "values.js";

const Container = styled.button`
  outline: none;
  border: none;
  text-decoration: none;

  background-color: ${(props) =>
    props.backgroundColor || props.theme.accentColor};
  color: ${(props) => props.color || props.theme.buttonTextColor};

  &:hover {
    background-color: ${(props) => {
      const val = new Values(props.theme.accentColor).shade(23);
      return `#${val.hex}`;
    }};
  }

  font-size: 18.5px;
  font-family: ${({ theme }) => theme.textFont};

  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};

  border-radius: ${(props) => props.borderRadius || "3px"};
  cursor: pointer;

  transition: background-color linear 0.08s;
`;

const InvertedButton = styled(Container)`
  background-color: #00000000;
  border: 1px solid
    ${(props) => props.backgroundColor || props.theme.accentColor};
`;

const Button = (props) => {
  if (props.inverted)
    return <InvertedButton {...props}>{props.children}</InvertedButton>;

  return <Container {...props}>{props.children}</Container>;
};

export default Button;
