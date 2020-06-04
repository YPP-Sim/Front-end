import React from "react";
import styled from "styled-components";

const Root = styled.p`
  font-size: 18px;
  text-align: justify;
  font-family: ${({ theme }) => theme.textFont};
`;

const SectionDescription = (props) => {
  return <Root>{props.children}</Root>;
};

export default SectionDescription;
