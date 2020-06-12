import React, { useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import Button from "../Button";
import refreshIcon from "../../SVGs/sync-alt-solid.svg";
import styled from "styled-components";

const Root = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
  background-color: #ddd;

  padding: 15px 25px;
  box-sizing: border-box;

  @media (max-width: 580px) {
    flex-direction: column;
  }
`;

const DisplayNameTitle = styled.h3`
  font-family: ${({ theme }) => theme.titleFont};
  font-size: 19px;
  margin: 0;
  font-weight: normal;

  @media (max-width: 580px) {
    margin-bottom: 10px;
  }
`;

const PlayerName = styled.span`
  font-family: ${({ theme }) => theme.textFont};
  font-size: 15.5px;
  margin: 0;
  font-weight: normal;
  margin-left: 7px;
`;

const SmallButton = styled(Button)`
  width: 115px;
  height: 32px;
  font-size: 14px;
  margin-left: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconImage = styled.img`
  width: 16px;
  object-fit: contain;
  margin-top: 3px;
`;

const InfoBar = ({ onRefresh, onEditName }) => {
  const { playerName } = useContext(PlayerContext);
  return (
    <Root>
      <DisplayNameTitle>
        Display Name: <PlayerName>{playerName}</PlayerName>
      </DisplayNameTitle>

      <ButtonContainer>
        <SmallButton onClick={onEditName}>Edit Name</SmallButton>
        <SmallButton onClick={onRefresh}>
          <IconImage src={refreshIcon} />
        </SmallButton>
      </ButtonContainer>
    </Root>
  );
};

export default InfoBar;
