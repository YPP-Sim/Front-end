import React from "react";
import styled from "styled-components";

const Root = styled.p`
  font-size: 19px;
  text-align: justify;
  line-height: 1.9;
  font-family: ${({ theme }) => theme.textFont};
`;

const SectionDescription = (props) => {
  return <Root>{props.children}</Root>;
};

export default SectionDescription;
