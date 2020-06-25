import React from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  font-weight: bold;
  font-size: 36px;
  letter-spacing: 1.8px;
  color: ${({ theme }) => theme.accentColor};
  margin: 0;
  margin-bottom: 80px;
  text-align: center;
`;

const SectionTitle = (props) => {
  return <Title>{props.children}</Title>;
};

export default SectionTitle;
