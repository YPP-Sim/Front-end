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

const UndecidedList = styled.p`
  margin: 5px 5px 5px 0px;
  font-family ${({ theme }) => theme.textFont};
  
`;

const TeamsView = ({ attackers, defenders, undecided }) => {
  return (
    <Root>
      <TeamContainer>
        <TeamTitle>Undecided</TeamTitle>
        {/* <UndecidedList>
          {undecided.reduce((prev, curr, currIndex) => {
            if (currIndex === 0) return prev;
            return prev + ", " + curr.name;
          }, undecided[0].name)}
        </UndecidedList> */}
        <CardGrid>
          {undecided.map((player, key) => (
            <PlayerCard
              name={player.playerName}
              shipType={player.shipType}
              key={key}
            />
          ))}
        </CardGrid>
      </TeamContainer>
      <TeamContainer>
        <TeamTitle>Attackers</TeamTitle>
        <CardGrid>
          {attackers &&
            attackers.map((attacker, key) => (
              <PlayerCard
                name={attacker.playerName}
                shipType={attacker.shipType}
                key={key}
              />
            ))}
        </CardGrid>
      </TeamContainer>
      <TeamContainer>
        <TeamTitle>Defenders</TeamTitle>
        <CardGrid>
          {defenders &&
            defenders.map((defender, key) => (
              <PlayerCard
                name={defender.playerName}
                shipType={defender.shipType}
                key={key}
              />
            ))}
        </CardGrid>
      </TeamContainer>
    </Root>
  );
};

export default TeamsView;
