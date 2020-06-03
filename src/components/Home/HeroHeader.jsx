import React from "react";
import styled from "styled-components";
import bgImage from "../../images/ship-whee1l.jpg";

const Root = styled.div`
  background: radial-gradient(
      at center center,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 65%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    url(${bgImage});

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
`;

const HeroHeader = () => {
  return <Root></Root>;
};

export default HeroHeader;
