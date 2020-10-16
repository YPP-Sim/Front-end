import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HomePage from "./components/Home/HomePage";
import { Route } from "react-router-dom";
import GameList from "./components/GameList/GameList";
import NavBar from "./components/HeroNavBar";
import GameLobby from "./components/GameLobby/GameLobby";
import { PlayerProvider } from "./contexts/PlayerContext";
import PatchNotesPage from "./components/PatchNotes/PatchNotesPage";
import LoginPage from "./components/Login/LoginPage";
import { UserProvider } from "./contexts/UserContext";

import axiosAuth from "./axios-config";
import axiosIntercept from "./util/init_interceptors";
import {getAccessToken, getRefreshToken, clear} from "./util/TokenStorage";
axiosIntercept();

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
  const [userData, setUserData] = useState({
      username: "",
      loggedIn: false,
  });

  useEffect(() => {
    if(!getAccessToken()) return;
    if(!getRefreshToken()) return;

    axiosAuth.post("/auth/validate-refresh-token", {refreshToken: getRefreshToken()})
    .then(response => {
      if(!response.data.valid) {
        clear();
      } else return axiosAuth.get("/user/whoami");
    })
    .then(response => {
      if(!response) return;
      
      setUserData({username: response.data.username, loggedIn: true});
    }).catch(err => {
      console.log(err);
    });

    
    
  }, []);

  const logout = () => {
    // Clear out the token storage
    clear();
    // Clear state
    setUserData({username: "", loggedIn: false});

    // Todo send request to 'logout' on server (invalidating any of the tokens)
    axiosAuth.post("/auth/logout", {refreshToken: getRefreshToken()}).then((res) => {
      console.log("Logged out from server");
    })
    .catch(err => {
      console.log("err logging out: ", err);
    })
    .finally(() => {
      window.location.replace("/login");
    });
  }

  return (
    <UserProvider value={{...userData, setUserData, logout}}>
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

          <Route exact path="/login">
            <NavBar />
            <LoginPage />
          </Route>

          <Route exact path="/patchnotes">
            <NavBar />
            <PatchNotesPage />
          </Route>

          <Route exact path="/games/:gameId">
            <NavBar />
            <GameLobby />
          </Route>
        </Root>
      </PlayerProvider>
    </UserProvider>
  );
};

export default App;
