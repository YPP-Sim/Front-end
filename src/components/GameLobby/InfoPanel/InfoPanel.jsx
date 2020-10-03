import React, { useContext } from "react";
import styled from "styled-components";
import GameContext from "../../../contexts/GameContext";
import PlayerContext from "../../../contexts/PlayerContext";
import IngameShipSelect from "../Ingame/IngameShipSelect";

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  gap: 25px 25px;
  grid-template-areas: "game-display action-center action-center";
  margin-top: 25px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.infoPanelButtonColor};
  color: ${({ theme }) => theme.textColor};
  font-family: ${({ theme }) => theme.textFont};
  border: none;
  outline: none;

  font-size: 18px;
  line-height: 20px;
  padding: 14px 30px;
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #94213b;
  }
`;

const GameStatsDisplay = styled.div`
  grid-area: game-display;
`;

const ActionCenter = styled.div`
  grid-area: action-center;
`;

const InfoPanel = ({ socket }) => {
  const { playerName } = useContext(PlayerContext);
  const { gameId } = useContext(GameContext);
  return (
    <Root>
      <GameStatsDisplay>
        <Button
          onClick={() => socket.emit("shipDisengage", { playerName, gameId })}
        >
          Disengage
        </Button>
      </GameStatsDisplay>
      <ActionCenter>
        <IngameShipSelect socket={socket} />
      </ActionCenter>
    </Root>
  );
};

export default InfoPanel;
