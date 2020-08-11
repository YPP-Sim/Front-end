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
`;

const FlexCenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridContainer = styled.div`
  margin: 0px 193px;
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  const { playerName, setPlayerName } = useContext(PlayerContext);
  const [games, setGames] = useState([]);

  const [formOpen, setFormOpen] = useState(true);
  const history = useHistory();

  useEffect(() => {
    refreshGameList(setGames);
  }, []);

  const handleCreateGameClick = () => {
    setFormOpen(true);
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
              onClick={() => history.push(`/games/${game.name}`)}
            />
          ))}
        </GridContainer>

        {formOpen && (
          <Backdrop>
            <CreateGameForm onClose={() => setFormOpen(false)} />
          </Backdrop>
        )}
      </FlexCenterContainer>
    </Root>
  );
};

export default GameList;
