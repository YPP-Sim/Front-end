import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameCard from "./GameCard";

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

const GameList = () => {
  return (
    <Root>
      <GridContainer>
        <GameCard
          title="Artysh's Game"
          status="WAITING"
          map="Aimuari Round I"
          currentPlayers={5}
          maxPlayers={12}
          hasPassword
        />

        <GameCard
          title="Artysh's Game"
          status="INGAME"
          map="Aimuari Round I"
          currentPlayers={2}
          maxPlayers={12}
        />
        <GameCard
          title="Artysh's Game"
          status="WAITING"
          map="Aimuari Round I"
          currentPlayers={5}
          maxPlayers={12}
        />
        <GameCard
          title="Artysh's Game"
          status="WAITING"
          map="Aimuari Round I"
          currentPlayers={1}
          maxPlayers={6}
          hasPassword
        />
        <GameCard
          title="Artysh's Game"
          status="INGAME"
          map="Aimuari Round I"
          currentPlayers={5}
          maxPlayers={12}
        />
        <GameCard
          title="Artysh's Game"
          status="ENDING"
          map="Aimuari Round I"
          currentPlayers={5}
          maxPlayers={12}
        />
        <GameCard
          title="Artysh's Game"
          status="WAITING"
          map="Aimuari Round I"
          currentPlayers={5}
          maxPlayers={12}
        />
      </GridContainer>
    </Root>
  );
};

export default GameList;
