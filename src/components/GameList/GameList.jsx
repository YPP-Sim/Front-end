import React, { useState, useEffect, useContext } from "react";
import PlayerContext from "../../contexts/PlayerContext";
import styled from "styled-components";
import GameCard from "./GameCard";
import plusIconImg from "../../SVGs/plus-solid.svg";
import axios from "../../axios-config";
import FAB from "./FAB";
import CreateGameForm from "./CreateGameForm";
import Backdrop from "../Backdrop";
import { useHistory } from "react-router-dom";
import PlayerNameForm from "./PlayerNameForm";

const Root = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.pageMaxWidth};
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridContainer = styled.div`
  margin: 25px;
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-items: center;
  width: 100%;
`;

const IconContainer = styled.img`
  width: 45%;
  height: 45%;
  color: white;
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
  const [formOpen, setFormOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    refreshGameList(setGames);
  }, []);

  const handleCreateGameClick = () => {
    setFormOpen(true);
  };

  return (
    <Root>
      <GridContainer>
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
      {playerName === "" && (
        <Backdrop>
          <PlayerNameForm />
        </Backdrop>
      )}

      {formOpen && (
        <Backdrop>
          <CreateGameForm onClose={() => setFormOpen(false)} />
        </Backdrop>
      )}

      {playerName !== "" && (
        <FAB onClick={handleCreateGameClick}>
          <IconContainer src={plusIconImg} />
        </FAB>
      )}
    </Root>
  );
};

export default GameList;
