import React from "react";
import styled from "styled-components";
import Button from "../Button";
import ShipSelection from "./ShipSelection";

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TeamContainer = styled.div`
  height: 100%;

  width: 99%;
  background: rgba(196, 196, 196, 0.1);
  border-radius: 12px;

  padding: 39px 25px;
  box-sizing: border-box;

  max-width: 383px;
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
`;

function repeatSection(amount) {
  return ["", "", "", "", "", "", "", ""];
}

const TeamsView = ({ attackers, defenders, undecided, player, onJoinTeam }) => {
  return (
    <Root>
      <TeamContainer>
        <TeamTitle>Attackers</TeamTitle>
        {repeatSection(2).map(() => (
          <JoinSection>
            <JoinButton width="151px" height="42px" noShadow={true}>
              Join
            </JoinButton>
            <ShipSelection disabled={true} />
          </JoinSection>
        ))}
      </TeamContainer>
      <TeamContainer>
        <TeamTitle>Defenders</TeamTitle>
        {repeatSection(2).map(() => (
          <JoinSection>
            <JoinButton width="151px" height="42px" noShadow={true}>
              Join
            </JoinButton>
            <ShipSelection />
          </JoinSection>
        ))}
      </TeamContainer>
    </Root>
  );
};

export default TeamsView;
