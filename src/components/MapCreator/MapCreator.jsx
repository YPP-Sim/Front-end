import React, { useState } from "react";
import styled from "styled-components";
import MapCell from "./MapCell";

const Root = styled.div``;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 30px);
  grid-template-rows: repeat(30, 30px);
  gap: 6px;
`;

function getDefaultLayout(width, height) {
  const newArray = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(0);
    }
    newArray.push(row);
  }
  return newArray;
}

function generateCells(layout, onChangeLayout, currentClose, setCurrentClose) {
  const elements = [];
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const cellId = layout[y][x];
      elements.push(
        <MapCell
          onChangeLayout={onChangeLayout}
          x={x}
          y={y}
          key={x + ":" + y}
          cellId={cellId}
          onClose={currentClose}
          setClose={setCurrentClose}
        />
      );
    }
  }
  return elements;
}

const MapCreator = () => {
  const [mapWidth, setMapWidth] = useState(20);
  const [mapHeight, setMapHeight] = useState(30);
  const [currentClose, setCurrentClose] = useState(null);
  const [layout, setLayout] = useState(getDefaultLayout(20, 30));

  const handleChangeLayout = (x, y, cellId) => {
    setLayout((prevLayout) => {
      const newLayout = [...prevLayout];
      newLayout[y][x] = cellId;
      return newLayout;
    });
  };

  return (
    <Root>
      <Grid>
        {" "}
        {generateCells(
          layout,
          handleChangeLayout,
          currentClose,
          setCurrentClose
        )}{" "}
      </Grid>
    </Root>
  );
};

export default MapCreator;
