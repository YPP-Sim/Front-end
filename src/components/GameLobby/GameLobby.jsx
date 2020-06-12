import React, { useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import { useHistory } from "react-router-dom";
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
const socket = io(ENDPOINT, { autoConnect: false });

const GameLobby = () => {
  const history = useHistory();
  const { gameId } = useParams();
  const { playerName } = useContext(PlayerContext);

  useEffect(() => {
    if (playerName.length === 0) history.push("/games");

    if (socket.disconnected) socket.open();

    socket.emit("joinGame", { gameId, playerName });
    return () => {
      socket.disconnect();
    };
  }, [gameId, playerName, history]);
  console.log("render");
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
