import React from "react";
import styled from "styled-components";
import Maps from "./Maps";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  margin-top: 100px;
`;


const MapsPage = () => {

  return <Root>
    <Maps />
  </Root>;
};

export default MapsPage;
