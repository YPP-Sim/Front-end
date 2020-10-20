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
import RegisterPage from "./components/Register/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountSettingsPage from "./components/AccountSettings/AccountSettingsPage";
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
    // Todo send request to 'logout' on server (invalidating any of the tokens)
    axiosAuth.post("/auth/logout", {refreshToken: getRefreshToken()}).then(() => {
      console.log("Logged out from server");
    })
    .catch(err => {
      console.log("err logging out: ", err);
    })
    .finally(() => {
      // Clear state
      window.location.replace("/login");
      setUserData({username: "", loggedIn: false});
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

          <Route exact path="/register">
            <NavBar />
            <RegisterPage />
          </Route>

          <Route exact path="/patchnotes">
            <NavBar />
            <PatchNotesPage />
          </Route>

          <Route exact path="/games/:gameId">
            <NavBar />
            <GameLobby />
          </Route>

          <ProtectedRoute path="/account-settings">
            <NavBar />
            <AccountSettingsPage />
          </ProtectedRoute>

        </Root>
      </PlayerProvider>
    </UserProvider>
  );
};

export default App;
