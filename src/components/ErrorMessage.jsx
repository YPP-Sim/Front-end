import React from "react";
import styled from "styled-components";

const Root = styled.p`
  margin: 0;
  padding: 0;

  color: #eb5757;

  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  text-align: right;
  transform: translateY(-12px);
`;

const ErrorMessage = ({ children }) => {
  return <Root>{children}</Root>;
};

export default ErrorMessage;
