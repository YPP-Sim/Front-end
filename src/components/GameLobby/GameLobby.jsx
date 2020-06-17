import React, { useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import GameChat from "./GameChat";
import Game from "../../game/Game";
import TeamsView from "./TeamsView";
import LobbySocketController from "./LobbySocketController";
import { useState } from "react";
import ShipSelection from "./ShipSelection";
import Button from "../Button";

const Root = styled.div`
  height: 100%;

  margin: 0 auto;
  padding: 20px;
`;

const MainContainer = styled.div`
  width: 100%;
  margin-right: 10px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.textFont};
  font-size: 19px;
  text-align: center;
  color: ${({ theme }) => theme.textColor};
`;

const TopContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const SideContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 250px;
  flex-direction: column;
  justify-content: space-between;
`;

const StartButton = styled(Button)`
  margin-top: 10px;
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
    gameOwner: gameData.gameOwner,
    status: gameData.status,
  };
}

function getViewByStatus(gameData, onJoinTeam, onSelect, socket, map, gameId) {
  if (map.length === 0) {
    socket.emit("requestMap", { gameId });
  }
  if (gameData.status === "INGAME")
    return (
      <MainContainer>
        {map.length > 0 ? (
          <Game map={map} gameData={gameData} socket={socket} gameId={gameId} />
        ) : (
          <p>loading...</p>
        )}
      </MainContainer>
    );
  else
    return (
      <MainContainer>
        <TeamsView
          attackers={gameData.attackers}
          defenders={gameData.defenders}
          undecided={gameData.undecided}
          onJoinTeam={onJoinTeam}
          player={gameData.thisPlayer}
        />
        <Title>Ship Selection</Title>
        <ShipSelection onSelect={onSelect} />
      </MainContainer>
    );
}

const GameLobby = () => {
  const [gameData, setGameData] = useState({
    undecided: [],
    attackers: [],
    defenders: [],
    map: [],
    gameOwner: "",
    status: "WAITING",
    thisPlayer: {},
  });
  const [map, setMap] = useState([]);
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

    socketController.registerEvent("gameMap", (gMap) => {
      setMap(gMap);
    });
    socketController.registerEvent("startGame", (gameData) => {
      setMap(gameData.map);
      setGameData(organizeGameData(gameData, playerName));
      console.log("GameDATA: ", gameData);
    });

    return () => {
      socketController.unregisterEvents();
      socket.disconnect();
    };
  }, [gameId, playerName, history]);

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

  const handleStart = () => {
    socket.emit("startGame", { gameId });
  };

  const onSelect = (ship) => {
    socket.emit("playerChangeShip", {
      playerName,
      gameId,
      shipType: ship,
    });
  };

  return (
    <Root>
      <TopContainer>
        {getViewByStatus(gameData, onJoinTeam, onSelect, socket, map, gameId)}
        <SideContainer>
          <GameChat gameId={gameId} socket={socket} />
          {gameData.gameOwner === playerName && gameData.status === "WAITING" && (
            <StartButton onClick={handleStart} backgroundColor="#29ca5a">
              START
            </StartButton>
          )}
        </SideContainer>
      </TopContainer>
    </Root>
  );
};

export default GameLobby;
