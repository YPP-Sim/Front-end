import React, { useState, useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import GameChat from "./GameChat";
import TeamsView from "./TeamsView";

const Root = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 20px;
  max-width: ${({ theme }) => theme.pageMaxWidth};
`;

const MainContainer = styled.div`
  width: 100%;
  margin-right: 10px;
`;

const ENDPOINT = "http://127.0.0.1:4000";

const GameLobby = () => {
  const [socket] = useState(io(ENDPOINT));
  const { gameId } = useParams();
  const { playerName } = useContext(PlayerContext);

  useEffect(() => {
    socket.emit("joinGame", { gameId, playerName });
    return () => {
      socket.emit("leaveGame", { gameId, playerName });
      socket.close();
    };
  }, [gameId, playerName, socket]);

  return (
    <Root>
      <MainContainer>
        <TeamsView />
      </MainContainer>
      <GameChat gameId={gameId} socket={socket} />
    </Root>
  );
};

export default GameLobby;
