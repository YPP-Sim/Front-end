import React from "react";
import styled from "styled-components";
import RotateLoader from "react-spinners/RotateLoader";

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlobalLoader = ({ size, color }) => {
  return (
    <Root>
      <RotateLoader
        color={color || "#29B3BC"}
        loading={true}
        size={size || 15}
      />
    </Root>
  );
};

export default GlobalLoader;
