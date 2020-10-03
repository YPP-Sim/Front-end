import React from "react";

import styled from "styled-components";

const Container = styled.button`
  outline: none;
  border: none;
  text-decoration: none;

  background: ${(props) => props.backgroundColor || props.theme.buttonBg};
  color: ${(props) => props.color || props.theme.buttonTextColor};

  font-size: ${(props) => props.fontSize || "24px"};
  font-style: normal;
  font-weight: 500;
  font-family: ${({ theme }) => theme.textFont};

  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};

  ${(props) =>
    props.noShadow ? "" : "box-shadow: 2px 2px 10px rgba(21, 21, 21, 0.3);"}

  border-radius: ${(props) => props.borderRadius || "12px"};
  cursor: pointer;

  transition: background-color linear 0.08s;

  user-select: none;

  &:disabled {
    background: #77777744;
    cursor: default;
    opacity: 0.95;
  }
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
