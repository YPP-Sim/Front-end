import React from "react";
import styled from "styled-components";
import PlayerCard from "./PlayerCard";
import Button from "../Button";

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
  grid-template-columns: repeat(auto-fit, minmax(150px, 225px));
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TeamsView = ({ attackers, defenders, undecided, player, onJoinTeam }) => {
  return (
    <Root>
      <TeamContainer>
        <TeamTitle>Undecided</TeamTitle>
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
        <TitleContainer>
          <TeamTitle>Attackers</TeamTitle>
          <Button
            onClick={() => onJoinTeam("ATTACKER")}
            margin="0px 0px 0px 15px"
            width="100px"
            height="34px"
            disabled={attackers.some(
              (attacker, key) => attacker.playerName === player.playerName
            )}
          >
            Join
          </Button>
        </TitleContainer>
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
        <TitleContainer>
          <TeamTitle>Defenders</TeamTitle>
          <Button
            onClick={() => onJoinTeam("DEFENDER")}
            margin="0px 0px 0px 15px"
            width="100px"
            height="34px"
            disabled={defenders.some(
              (defender, key) => defender.playerName === player.playerName
            )}
          >
            Join
          </Button>
        </TitleContainer>
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
