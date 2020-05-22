import React from "react";
import styled from "styled-components";
import Game from "./game/Game";
import SocketTestForm from "./components/SocketTestForm";

const Root = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: 25px;
`;

const canvasWidth = 700;
const canvasHeight = 500;

const App = () => {
  //   Some redundancy here TODO
  return (
    <Root width={canvasWidth} height={canvasHeight}>
      <Game width={canvasWidth} height={canvasHeight} />
      <SocketTestForm />
    </Root>
  );
};

export default App;
