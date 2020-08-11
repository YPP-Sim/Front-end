import React from "react";
import styled from "styled-components";

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(32, 40, 48, 0.8);
`;

const Backdrop = (props) => {
  return <Root>{props.children}</Root>;
};

export default Backdrop;
