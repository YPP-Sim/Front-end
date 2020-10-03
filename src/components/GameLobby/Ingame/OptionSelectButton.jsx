import React from "react";
import styled from "styled-components";

const Root = styled.div`
  padding: 8px 12px;
  background-color: ${(props) =>
    props.active ? "#FCF340" : "rgba(255,255,255,0.08)"};

  font-family: ${({ theme }) => theme.textFont};
  color: ${(props) => (props.active ? "#22210a" : props.theme.textColor)};
  font-size: 16px;
  user-select: none;
  text-align: center;

  cursor: pointer;

  margin-top: 8px;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) =>
      props.active ? "#FCF340" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const OptionSelectButton = (props) => {
  return <Root {...props}>{props.children}</Root>;
};

export default OptionSelectButton;
