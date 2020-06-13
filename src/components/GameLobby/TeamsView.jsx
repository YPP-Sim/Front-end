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

const JoinButton = styled(Button)`
  height: 120px;
`;

const TeamsView = ({ attackers, defenders, undecided, player, onJoinTeam }) => {
  return (
    <Root>
      {undecided.length > 0 && (
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
      )}
      <TeamContainer>
        <TitleContainer>
          <TeamTitle>Attackers</TeamTitle>
        </TitleContainer>
        <CardGrid>
          {attackers &&
            attackers.map((attacker, key) => (
              <PlayerCard
                name={attacker.playerName}
                shipType={attacker.shipData ? attacker.shipData.shipType : ""}
                key={key}
              />
            ))}
          {!attackers.some(
            (attacker) => attacker.playerName === player.playerName
          ) && (
            <JoinButton onClick={() => onJoinTeam("ATTACKER")}>Join</JoinButton>
          )}
        </CardGrid>
      </TeamContainer>
      <TeamContainer>
        <TitleContainer>
          <TeamTitle>Defenders</TeamTitle>
        </TitleContainer>
        <CardGrid>
          {defenders &&
            defenders.map((defender, key) => (
              <PlayerCard
                name={defender.playerName}
                shipType={defender.shipData ? defender.shipData.shipType : ""}
                key={key}
              />
            ))}
          {!defenders.some(
            (defender) => defender.playerName === player.playerName
          ) && (
            <JoinButton onClick={() => onJoinTeam("DEFENDER")}>Join</JoinButton>
          )}
        </CardGrid>
      </TeamContainer>
    </Root>
  );
};

export default TeamsView;
