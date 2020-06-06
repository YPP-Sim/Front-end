import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameCard from "./GameCard";
import plusIconImg from "../../SVGs/plus-solid.svg";
import axios from "../../axios-config";
import FAB from "./FAB";

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

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/games/game-list")
      .then((res) => {
        setGames(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }, []);

  return (
    <Root>
      <FAB>
        <IconContainer src={plusIconImg} />
      </FAB>
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
          />
        ))}
      </GridContainer>
    </Root>
  );
};

export default GameList;
