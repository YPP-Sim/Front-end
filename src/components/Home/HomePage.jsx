import React from "react";
import styled from "styled-components";
import HeroHeader from "./HeroHeader";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";

const Root = styled.div``;

const HomePage = () => {
  return (
    <Root>
      <HeroHeader />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
    </Root>
  );
};

export default HomePage;
