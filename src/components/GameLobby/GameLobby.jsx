import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4000";
const socket = io(ENDPOINT);

const Root = styled.div``;

const GameLobby = () => {
  const { gameId } = useParams();

  useEffect(() => {
    socket.emit("joinGame", gameId);
    return () => {
      socket.emit("leaveGame", gameId);
    };
  }, [gameId]);

  return <Root></Root>;
};

export default GameLobby;
