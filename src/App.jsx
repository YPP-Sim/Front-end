import React, { useState } from "react";
import styled from "styled-components";
import HomePage from "./components/Home/HomePage";
import { Route } from "react-router-dom";
import GameList from "./components/GameList/GameList";
import NavBar from "./components/HeroNavBar";
import GameLobby from "./components/GameLobby/GameLobby";
import { PlayerProvider } from "./contexts/PlayerContext";

const Root = styled.div`
  height: 100%;
`;

function getDefaultName() {
  if (localStorage.getItem("playerName"))
    return localStorage.getItem("playerName");
  return "";
}

function setDefaultName(name) {
  localStorage.setItem("playerName", name);
}

const App = () => {
  const [playerName, setPlayerName] = useState(getDefaultName());
  return (
    <PlayerProvider value={{ playerName, setPlayerName, setDefaultName }}>
      <Root>
        <Route exact path="/">
          <NavBar />
          <HomePage />
        </Route>

        <Route exact path="/games">
          <NavBar />
          <GameList />
        </Route>

        <Route exact path="/games/:gameId">
          <NavBar />
          <GameLobby />
        </Route>
      </Root>
    </PlayerProvider>
  );
};

export default App;
