import React from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  font-weight: 700;
  font-size: 30px;
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.accentColor};
  width: fit-content;
`;

const SectionTitle = (props) => {
  return <Title>{props.children}</Title>;
};

export default SectionTitle;
