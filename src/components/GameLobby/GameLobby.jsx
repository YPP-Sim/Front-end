import React, { useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import GameChat from "./GameChat";
import TeamsView from "./TeamsView";
import LobbySocketController from "./LobbySocketController";
import { useState } from "react";

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
const socketController = new LobbySocketController(socket);

function organizeGameData(gameData, thisPlayerName) {
  const attackers = [];
  const defenders = [];
  const undecided = [];
  let thisPlayer;
  for (let data of gameData.players) {
    if (data.playerName === thisPlayerName) thisPlayer = data;

    switch (data.side) {
      case "ATTACKER":
        attackers.push(data);
        break;
      case "DEFENDER":
        defenders.push(data);
        break;
      case "UNDECIDED":
      default:
        undecided.push(data);
        break;
    }
  }

  return {
    attackers,
    defenders,
    undecided,
    thisPlayer,
    status: gameData.status,
  };
}

const GameLobby = () => {
  const [gameData, setGameData] = useState({
    undecided: [],
    attackers: [],
    defenders: [],
    status: "WAITING",
    thisPlayer: {},
  });
  const history = useHistory();
  const { gameId } = useParams();
  const { playerName } = useContext(PlayerContext);

  useEffect(() => {
    if (playerName.trim().length === 0) history.push("/games");

    if (socket.disconnected) socket.open();

    socketController.registerEvents();
    socket.emit("joinGame", { gameId, playerName });

    socketController.registerEvent("gameData", (gameData) => {
      setGameData(organizeGameData(gameData, playerName));
    });

    return () => {
      socketController.unregisterEvents();
      socket.disconnect();
    };
  }, [gameId, playerName, history]);

  console.log("Game Data: ", gameData);

  const onJoinTeam = (team) => {
    switch (team) {
      case "ATTACKER":
        socket.emit("joinTeam", { playerName, side: "ATTACKER", gameId });
        break;
      case "DEFENDER":
        socket.emit("joinTeam", { playerName, side: "DEFENDER", gameId });
        break;
      case "UNDECIDED":
      default:
        break;
    }
  };

  return (
    <Root>
      <MainContainer>
        <TeamsView
          attackers={gameData.attackers}
          defenders={gameData.defenders}
          undecided={gameData.undecided}
          onJoinTeam={onJoinTeam}
          player={gameData.thisPlayer}
        />
      </MainContainer>
      <GameChat gameId={gameId} socket={socket} />
    </Root>
  );
};

export default GameLobby;
