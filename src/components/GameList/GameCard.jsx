import React from "react";
import styled from "styled-components";
import playerIcon from "../../images/player-icon.png";
import mapIcon from "../../images/map-icon.png";
import passwordIcon from "../../images/password-icon.png";
import battlePic from "../../images/battle_nav.jpg";

const Root = styled.div`
  min-width: 200px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: border-box;

  overflow: hidden;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  cursor: pointer;
`;

const StatusBar = styled.div`
  background-color: ${(props) => {
    switch (props.status) {
      case "WAITING":
        return "#313131";
      case "INGAME":
        return "#52D66F";
      case "ENDING":
        return "#D65252";
      default:
        return "#313131";
    }
  }};

  width: 100%;
  height: 40px;
  font-family: ${({ theme }) => theme.textFont};
  letter-spacing: 0.7px;
  font-size: 14px;
  line-height: 13px;
  text-align: center;
  color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;

  margin-top: 10px;
`;

const GameTitle = styled.h2`
  color: ${({ theme }) => theme.textColor};
  font-family: ${({ theme }) => theme.titleFont};
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  margin: 0;

  margin-bottom: 15px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 80px;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 16px;
  font-family: ${({ theme }) => theme.textFont};
  color: ${({ theme }) => theme.textColor};
`;

const FlexContainer = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const InfoContainer = styled.div`
  padding: 10px 25px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
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
  onClick,
}) => {
  return (
    <Root onClick={onClick}>
      <CardImage src={battlePic} />
      <InfoContainer>
        <GameTitle>{title}</GameTitle>

        <FlexContainer>
          <Icon src={playerIcon} />
          <InfoText>
            {currentPlayers}/{maxPlayers}
          </InfoText>
        </FlexContainer>
        <FlexContainer>
          <Icon src={mapIcon} />
          <InfoText>{map}</InfoText>
        </FlexContainer>
        <FlexContainer>
          <Icon src={passwordIcon} />
          <InfoText>{hasPassword ? "Locked" : "Unlocked"}</InfoText>
        </FlexContainer>
      </InfoContainer>
      <StatusBar status={status}>{getStatusDescription(status)}</StatusBar>
    </Root>
  );
};

export default GameCard;
