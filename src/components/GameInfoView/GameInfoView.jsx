import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "../../axios-config";

const Root = styled.div``;

const exampleGameData = {
  name: "Example's Game",
  attackers: [],
  defenders: [],
  status: "WAITING",
  locked: false,
};

const GameInfoView = () => {
  const [gameData, setGameData] = useState({});
  const { gameId } = useParams();

  useEffect(() => {
    axios
      .get(`/games/${gameId}`)
      .then((res) => {
        console.log("game info data: ", res.data);
        setGameData(res.data);
      })
      .catch((err) => {
        console.log("Error getting game data: ", err);
      });
  }, [gameId]);

  return <Root></Root>;
};

export default GameInfoView;
