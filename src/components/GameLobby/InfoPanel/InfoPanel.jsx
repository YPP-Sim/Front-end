import React, { useContext } from "react";
import styled from "styled-components";
import GameContext from "../../../contexts/GameContext";
import PlayerContext from "../../../contexts/PlayerContext";

const Root = styled.div`
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

const InfoPanel = ({ socket }) => {
  const { playerName } = useContext(PlayerContext);
  const { gameId } = useContext(GameContext);
  return (
    <Root>
      <Button
        onClick={() => socket.emit("shipDisengage", { playerName, gameId })}
      >
        Disengage
      </Button>
    </Root>
  );
};

export default InfoPanel;
