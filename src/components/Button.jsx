import React from "react";

import styled from "styled-components";
import Values from "values.js";

const Container = styled.button`
  outline: none;
  border: none;
  text-decoration: none;

  background-color: ${(props) =>
    props.backgroundColor || props.theme.buttonBackgroundColor};
  color: ${(props) => props.color || props.theme.buttonTextColor};

  // background-image: linear-gradient(0.40turn, #ffa500, #ffcba4);

  font-size: 17.5px;

  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};

  border-radius: ${(props) => props.borderRadius || "3px"};
  cursor: pointer;

  transition: background-color linear 0.08s;
  &:hover {
    background-color: ${(props) => {
      const val = new Values(
        props.backgroundColor || props.theme.buttonBackgroundColor
      ).shade(23);
      return `#${val.hex}`;
    }};
  }
`;

const Button = (props) => {
  return <Container {...props}>{props.children}</Container>;
};

export default Button;
