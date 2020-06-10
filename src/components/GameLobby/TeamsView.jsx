import React from "react";
import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ddd;
  margin-right: 10px;
`;

const TeamContainer = styled.div`
  display: flex;
  //   background-color: #222;
  height: 50%;
  padding: 8px;
  box-sizing: border-box;
`;

const TeamTitle = styled.h2`
  font-family: ${({ theme }) => theme.titleFont};
  font-size: 20px;
  margin: 0;
  font-weight: normal;
`;
const TeamsView = () => {
  return (
    <Root>
      <TeamContainer>
        <TeamTitle>Attackers</TeamTitle>
      </TeamContainer>
      <TeamContainer>
        <TeamTitle>Defenders</TeamTitle>
      </TeamContainer>
    </Root>
  );
};

export default TeamsView;
