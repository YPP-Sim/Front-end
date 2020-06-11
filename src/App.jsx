import React, { useState } from "react";
import styled from "styled-components";
import HomePage from "./components/Home/HomePage";
import { Route } from "react-router-dom";
import GameList from "./components/GameList/GameList";
import NavBar from "./components/NavBar";
import GameInfoView from "./components/GameInfoView/GameInfoView";
import GameLobby from "./components/GameLobby/GameLobby";
import { PlayerProvider } from "./contexts/PlayerContext";

const Root = styled.div`
  height: 100%;
`;

const App = () => {
  const [playerName, setPlayerName] = useState("");
  return (
    <PlayerProvider value={{ playerName, setPlayerName }}>
      <Root>
        <Route exact path="/">
          <HomePage />
        </Route>

        <Route exact path="/games">
          <NavBar />
          <GameList />
        </Route>

        <Route exact path="/games/:gameId">
          <NavBar />
          {/* <GameInfoView /> */}
          <GameLobby />
        </Route>
      </Root>
    </PlayerProvider>
  );
};

export default App;
