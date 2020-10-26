import React from "react";
import styled from "styled-components";
import MapCreator from "./MapCreator";

const Root = styled.div`
    display: flex;
    align-items: center;  
    justify-content: center;
    min-height: 500px;
    margin-top: 100px;
    margin-bottom: 200px;
`;


const MapCreatorPage = () => {
  return <Root>

    <MapCreator />
  </Root>;
};

export default MapCreatorPage;
