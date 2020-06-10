import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import GameChat from "./GameChat";
import TeamsView from "./TeamsView";

const ENDPOINT = "http://127.0.0.1:4000";
const socket = io(ENDPOINT);

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

const GameLobby = () => {
  const { gameId } = useParams();

  useEffect(() => {
    socket.emit("joinGame", gameId);
    return () => {
      socket.emit("leaveGame", gameId);
    };
  }, [gameId]);

  return (
    <Root>
      <MainContainer>
        <TeamsView />
      </MainContainer>
      <GameChat />
    </Root>
  );
};

export default GameLobby;
