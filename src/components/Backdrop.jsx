import React from "react";
import styled, { keyframes } from "styled-components";

const opacityAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(32, 40, 48, 0.8);

  animation: ${opacityAnimation} 0.2s ease-in;
`;

const Backdrop = (props) => {
  return <Root>{props.children}</Root>;
};

export default Backdrop;
