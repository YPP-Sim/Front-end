import React from "react";
import styled from "styled-components";

const Root = styled.div`
  background: rgba(196, 196, 196, 0.05);
  padding: 0px 200px;

  height: 700px;
`;

const HomeContent = ({ children }) => {
  return <Root>{children}</Root>;
};

export default HomeContent;
