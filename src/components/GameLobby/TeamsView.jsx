import React from "react";
import styled from "styled-components";
import Button from "../Button";
import ShipSelection from "./ShipSelection";

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const TeamContainer = styled.div`
  height: 100%;

  width: 99%;
  background: rgba(196, 196, 196, 0.1);
  border-radius: 12px;

  padding: 39px 25px;
  box-sizing: border-box;

  max-width: 383px;

  margin-left: ${(props) => (props.right ? "14px" : "0px")};

  @media (max-width: 1000px) {
    margin-left: 0px;
    margin-bottom: 20px;
    max-width: 500px;
  }
`;

const Teams = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 795px;

  margin: 0 auto;

  @media (max-width: 1000px) {
    flex-direction: column;
    max-width: 500px;
  }
`;

const TeamTitle = styled.h2`
  font-family: ${({ theme }) => theme.textFont};
  font-size: 24px;
  margin: 0;
  font-weight: bold;

  text-align: center;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 32px;
`;

const JoinSection = styled.div`
  display: flex;
  height: 42px;

  margin-bottom: 8px;
`;

const JoinButton = styled(Button)`
  background: rgba(196, 196, 196, 0.25);
  border-radius: 6px;
  font-size: 14px;
  width: 50%;
  height: 42px;
`;

const JoinName = styled.div`
  background: rgba(196, 196, 196, 0.5);
  border-radius: 6px;
  font-size: 14px;
  width: 50%;
  height: 42px;

  display: flex;
  justify-content: center;
  font-weight: 500;
  align-items: center;
  font-family: ${({ theme }) => theme.textFont};
  color: ${({ theme }) => theme.textColor};
`;

const ShipName = styled(JoinName)`
  margin-left: 16px;
  font-weight: normal;
  background: rgba(196, 196, 196, 0.5);
  color: rgba(255, 255, 255, 0.75);
`;

function transformShipTypeToIndex(shipType) {
  switch (shipType) {
    case "WAR_FRIG":
      return 1;
    case "WAR_BRIG":
      return 2;
    default:
      return "Unknown";
  }
}

function transformShipTypeToName(shipType) {
  switch (shipType) {
    case "WAR_FRIG":
      return "War Frig";
    case "WAR_BRIG":
      return "War Brig";
    default:
      return "Unknown";
  }
}

function renderTeamViewList(playerList, player, onSelect, onJoinTeam, side) {
  const totalSpots = 7;
  const components = playerList.map((attacker, i) => {
    const isThisPlayer = attacker.playerName === player.playerName;
    return (
      <JoinSection key={attacker.playerName}>
        <JoinName>{attacker.playerName}</JoinName>
        {isThisPlayer ? (
          <ShipSelection
            onSelect={onSelect}
            defaultSelected={
              attacker.shipData
                ? transformShipTypeToIndex(attacker.shipData.shipType)
                : null
            }
            isThisPlayer={attacker.playerName === player.playerName}
          />
        ) : (
          <ShipName>
            {attacker.shipData
              ? transformShipTypeToName(attacker.shipData.shipType)
              : "Unknown"}
          </ShipName>
        )}
      </JoinSection>
    );
  });

  const remaining = totalSpots - playerList.length;

  for (let i = 0; i < remaining; i++) {
    components.push(
      <JoinSection key={i}>
        <JoinButton onClick={() => onJoinTeam(side)} noShadow={true}>
          Join
        </JoinButton>
        <ShipSelection onSelect={onSelect} disabled />
      </JoinSection>
    );
  }

  return components;
}

const TeamsView = ({
  attackers,
  defenders,
  undecided,
  player,
  onJoinTeam,
  onSelect,
}) => {
  return (
    <Root>
      <Teams>
        <TeamContainer>
          <TeamTitle>Attackers</TeamTitle>
          {renderTeamViewList(
            attackers,
            player,
            onSelect,
            onJoinTeam,
            "ATTACKER"
          )}
        </TeamContainer>
        <TeamContainer right>
          <TeamTitle>Defenders</TeamTitle>
          {renderTeamViewList(
            defenders,
            player,
            onSelect,
            onJoinTeam,
            "DEFENDER"
          )}
        </TeamContainer>
      </Teams>
    </Root>
  );
};

export default TeamsView;
