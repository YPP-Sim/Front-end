import React from "react";
import styled from "styled-components";
import HeroHeader from "./HeroHeader";
import HomeContent from "./HomeContent";
import HomeWave from "./HomeWave";

const Root = styled.div``;

const HomePage = () => {
  return (
    <Root>
      <HeroHeader />
      <HomeWave />
      <HomeContent></HomeContent>
    </Root>
  );
};

export default HomePage;
