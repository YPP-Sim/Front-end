import React from "react";
import styled from "styled-components";
import HomePage from "./components/Home/HomePage";
import NavBar from "./components/NavBar";
// import Game from "./game/Game";
// import SocketTestForm from "./components/SocketTestForm";

const Root = styled.div`
  // width: ${(props) => props.width}px;
  // height: ${(props) => props.height}px;
  // margin: 25px;
`;

const App = () => {
  return (
    <Root>
      <NavBar />
      {/* <Game width={canvasWidth} height={canvasHeight} />
      <SocketTestForm /> */}
      <HomePage />
    </Root>
  );
};

export default App;
