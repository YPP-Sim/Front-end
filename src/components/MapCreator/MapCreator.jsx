import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MapCell from "./MapCell";
import ThemedButton from "../ThemedButton";

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

function generateCells(layout, onChangeLayout) {
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
        />
      );
    }
  }
  return elements;
}

// create a copy of array
function getLayoutCopy(layout) {
  return layout.map((row) => {
    return row.slice();
  });
}

const defaultLayout = getDefaultLayout(20, 30);

const MapCreator = () => {
  const [layout, setLayout] = useState(defaultLayout);

  useEffect(() => {
    console.log("Layout changed: ", layout);
  }, [layout]);

  const handleChangeLayoutDimensions = (toWidth, toHeight) => {
    const mapHeight = layout.length;
    const mapWidth = layout[0].length;

    const dW = toWidth - mapWidth;
    const dH = toHeight - mapHeight;

    if (dW > 0) {
      // Add columns
    } else if (dW < 0) {
      // Remove columns;
    }

    if (dH > 0) {
      // Add rows
      setLayout((prevLayout) => {
        const newArray = getLayoutCopy(prevLayout);
        for (let i = 0; i < dH; i++) {
          const newRow = [];
          for (let x = 0; x < toWidth; x++) {
            newRow.push(0);
          }
          newArray.push(newRow);
        }
        return newArray;
      });
    } else if (dH < 0) {
      // Remove rows
      setLayout((prevLayout) => {
        const newArray = getLayoutCopy(prevLayout);
        for (let i = 0; i > dH; i--) {
          newArray.pop();
        }
        return newArray;
      });
    }
  };

  const handleChangeLayout = (x, y, cellId) => {
    setLayout((prevLayout) => {
      const newLayout = [...prevLayout];
      newLayout[y][x] = cellId;
      return newLayout;
    });
  };

  return (
    <Root>
      <ThemedButton onClick={() => handleChangeLayoutDimensions(20, 35)}>
        Test
      </ThemedButton>
      <Grid>{generateCells(layout, handleChangeLayout)}</Grid>
    </Root>
  );
};

export default MapCreator;
