import React, { useEffect } from "react";
import styled from "styled-components";
import game from "./game/game";

const Root = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: 0 auto;
`;

const Canvas = styled.canvas`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: 1px solid #f1f1f1;
`;

const canvasWidth = 700;
const canvasHeight = 500;

const App = () => {
  useEffect(() => {
    game(canvasWidth, canvasHeight);
  }, []);

  //   Some redundancy here TODO
  return (
    <Root width={canvasWidth} height={canvasHeight}>
      test
      <Canvas
        width={canvasWidth}
        height={canvasHeight}
        id="game-canvas"
      ></Canvas>
    </Root>
  );
};

export default App;
