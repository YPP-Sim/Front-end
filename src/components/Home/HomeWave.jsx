import React from "react";
import styled from "styled-components";

const Root = styled.div`
  background: rgba(196, 196, 196, 0.05);
  clip-path: url(#wave);
  height: 170px;
  width: 100%;
`;

const HomeWave = () => {
  return <Root></Root>;
};

export default HomeWave;
