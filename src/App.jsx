import React from "react";
import styled from "styled-components";
import HomePage from "./components/Home/HomePage";
import { Route } from "react-router-dom";
import GameList from "./components/GameList/GameList";
const Root = styled.div``;

const App = () => {
  return (
    <Root>
      <Route exact path="/">
        <HomePage />
      </Route>

      <Route exact path="/games">
        <GameList />
      </Route>
    </Root>
  );
};

export default App;
