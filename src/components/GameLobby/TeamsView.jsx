import React from "react";
import styled from "styled-components";
import PlayerCard from "./PlayerCard";

const Root = styled.div`
  width: 100%;
  background-color: #ddd;
  margin-right: 10px;
`;

const TeamContainer = styled.div`
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  width: 100%;
  height: 100%;
  gap: 15px;
  margin-top: 5px;
  padding: 7px;
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
        <CardGrid>
          <PlayerCard name="Arty" shipType="WAR_FRIG" />
          <PlayerCard name="Layli" shipType="WAR_BRIG" />
          <PlayerCard name="Putosqu" shipType="WAR_BRIG" />
        </CardGrid>
      </TeamContainer>
      <TeamContainer>
        <TeamTitle>Defenders</TeamTitle>
        <CardGrid>
          <PlayerCard name="Arty" shipType="WAR_FRIG" />
          <PlayerCard name="Layli" shipType="WAR_BRIG" />
          <PlayerCard name="Putosqu" shipType="WAR_BRIG" />
        </CardGrid>
      </TeamContainer>
    </Root>
  );
};

export default TeamsView;
