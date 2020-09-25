import React, { useState, useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import styled from "styled-components";
import GameCard from "./GameCard";
import axios from "../../axios-config";
import CreateGameForm from "./CreateGameForm";
import Backdrop from "../Backdrop";
import { useHistory } from "react-router-dom";
import CreateGameCard from "./CreateGameCard";

const Root = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.pageMaxWidth};
  margin: 0 auto;

  padding-bottom: 200px;
`;

const FlexCenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridContainer = styled.div`
  margin: 0px 193px;
  display: grid;
  gap: 34px;
  grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
  justify-items: center;
  width: 100%;
`;

const LobbyTitle = styled.h1`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 53px;

  text-align: center;
  margin-top: 96px;
  margin-bottom: 68px;

  color: ${({ theme }) => theme.textColor};
`;

function refreshGameList(setGames) {
  axios
    .get("/games/game-list")
    .then((res) => {
      setGames(res.data);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
}

const GameList = () => {
  const [games, setGames] = useState([]);
  const { playerName } = useContext(PlayerContext);

  const [createGameFormOpen, setCreateGameFormOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    refreshGameList(setGames);
  }, []);

  const handleCreateGameClick = () => {
    setCreateGameFormOpen(true);
  };

  const handleJoin = async (gameId, password) => {
    // Ask server first before we can join.

    try {
      const response = await axios.post("/games/join-game-request", {
        gameId,
        requestedPlayerName: playerName,
        password,
      });
      sessionStorage.setItem("token", response.data.token);
      history.push(`/games/${gameId}`);
    } catch (err) {
      return err.response.data;
    }
  };

  return (
    <Root>
      <LobbyTitle>Lobby</LobbyTitle>
      <FlexCenterContainer>
        <GridContainer>
          <CreateGameCard onClick={handleCreateGameClick} />
          {games.map((game, key) => (
            <GameCard
              title={game.name}
              status={game.status}
              map={game.mapName}
              currentPlayers={game.currentPlayers}
              maxPlayers={game.maxPlayers}
              hasPassword={game.locked}
              key={key}
              onJoin={handleJoin}
            />
          ))}
        </GridContainer>

        {createGameFormOpen && (
          <Backdrop>
            <CreateGameForm onClose={() => setCreateGameFormOpen(false)} />
          </Backdrop>
        )}
      </FlexCenterContainer>
    </Root>
  );
};

export default GameList;
