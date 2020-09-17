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
`;

function repeatSection(amount) {
  return ["", "", "", "", "", "", ""];
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
          {repeatSection(2).map(() => (
            <JoinSection>
              <JoinButton width="151px" height="42px" noShadow={true}>
                Join
              </JoinButton>
              <ShipSelection onSelect={onSelect} disabled={true} />
            </JoinSection>
          ))}
        </TeamContainer>
        <TeamContainer right>
          <TeamTitle>Defenders</TeamTitle>
          {repeatSection(2).map(() => (
            <JoinSection>
              <JoinButton width="151px" height="42px" noShadow={true}>
                Join
              </JoinButton>
              <ShipSelection onSelect={onSelect} />
            </JoinSection>
          ))}
        </TeamContainer>
      </Teams>
    </Root>
  );
};

export default TeamsView;
