import React, { useState } from "react";
import styled from "styled-components";
import playerIcon from "../../SVGs/playerIcon.svg";
import mapIcon from "../../SVGs/mapIcon.svg";
import unlockedIcon from "../../SVGs/unlockedIcon.svg";
import lockedIcon from "../../SVGs/lockedIcon.svg";
import Divider from "../Divider";

import Backdrop from "../Backdrop";
import ChooseUsernameForm from "./ChooseUsernameForm";

const Root = styled.div`
  width: 238px;
  height: 339px;
  left: 465px;
  top: 291px;

  background: rgba(196, 196, 196, 0.1);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 27px 29px;

  cursor: pointer;
`;

const StatusBar = styled.div`
  background: ${(props) => {
    switch (props.status) {
      case "WAITING":
        return "#FFFFFF";
      case "INGAME":
        return "linear-gradient(88.42deg, #609ACF -8.65%, #29B3BC 99.01%);";
      case "ENDING":
        return "#D65252";
      default:
        return "linear-gradient(88.42deg, #609ACF -8.65%, #29B3BC 99.01%);";
    }
  }};

  color: ${(props) =>
    props.status === "WAITING" ? "#29B3BC" : props.theme.textColor};

  width: 100%;
  height: 40px;
  font-family: ${({ theme }) => theme.textFont};
  font-size: 18px;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;

  margin-top: 32px;
`;

const GameTitle = styled.h2`
  color: ${({ theme }) => theme.textColor};
  font-family: ${({ theme }) => theme.textFont};
  font-weight: 500;
  font-size: 24px;
  line-height: 35px;
  text-align: center;
  margin: 0;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  font-family: ${({ theme }) => theme.textFont};
  color: ${({ theme }) => theme.textColor};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.mb};
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: ${(props) => props.mr};
`;

function getStatusDescription(status) {
  switch (status) {
    case "WAITING":
      return "Waiting to start";
    case "INGAME":
      return "Ingame";
    case "ENDING":
      return "Ending Soon";
    default:
      return "Waiting to start";
  }
}

const GameCard = ({
  title,
  status,
  currentPlayers,
  maxPlayers,
  map,
  hasPassword,
  onJoin,
}) => {
  const [usernameFormOpen, setUsernameFormOpen] = useState(false);

  return (
    <Root onClick={() => setUsernameFormOpen(true)}>
      {usernameFormOpen && (
        <Backdrop>
          <ChooseUsernameForm
            onJoin={onJoin}
            hasPassword={hasPassword}
            gameId={title}
          />
        </Backdrop>
      )}
      <GameTitle>{title}</GameTitle>
      <Divider mt="21px" mb="31px" />
      <FlexContainer mb="24px">
        <Icon mr="19px" src={playerIcon} />
        <InfoText>
          {currentPlayers}/{maxPlayers}
        </InfoText>
      </FlexContainer>
      <FlexContainer mb="24px">
        <Icon mr="16px" src={mapIcon} />
        <InfoText>{map}</InfoText>
      </FlexContainer>
      <FlexContainer>
        <Icon mr="18px" src={hasPassword ? lockedIcon : unlockedIcon} />
        <InfoText>{hasPassword ? "Locked" : "Unlocked"}</InfoText>
      </FlexContainer>
      <StatusBar status={status}>{getStatusDescription(status)}</StatusBar>
    </Root>
  );
};

export default GameCard;
