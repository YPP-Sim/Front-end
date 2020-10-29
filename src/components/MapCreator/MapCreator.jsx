import React, { useState } from "react";
import styled from "styled-components";
import MapCell from "./MapCell";
import MapCreatorSettings from "./MapCreatorSettings";
import MapView from "../Maps/MapView";
import closeIcon from "../../SVGs/close_icon.svg";
import axiosAuth from "../../axios-config";
import GlobalLoader from "../loaders/GlobalLoader";
import Title from "../Forms/Title";
import popup from "../../styled-animations/popup";
import ErrorMessage from "../Forms/ErrorMessage";

const Root = styled.div``;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 30px);
  grid-template-rows: repeat(30, 30px);
  gap: 6px;
`;

const MapViewPopup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 500px;
  height: 550px;
  background-color: #232323;
  border-radius: 4px;
  padding: 5px;
  z-index: 90;
`;

const CloseIcon = styled.img`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 3px;
  right: 3px;
  padding: 5px;
  opacity: 0.5;
  transition: opacity 0.15s ease-out;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const LoadingMessage = styled(Title)`
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 50px;
`;

const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  background-color: white;
  padding: 35px;
  box-sizing: border-box;
  border-radius: 4px;

  animation: ${popup} 0.2s linear;
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
  const [previewing, setPreviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    success: null,
    error: "",
  }); // Null at first to say that a request hasn't been made yet

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

  const handleCreate = (mapName) => {
    if (mapName.length === 0) {
      setResponse({ success: false, error: "Map name must not be empty" });
      return;
    }

    setLoading(true);
    setResponse({ success: null, error: "" });
    axiosAuth
      .post("/maps", { title: mapName, layout })
      .then(() => setResponse({ success: true }))
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error)
          setResponse({ success: false, error: err.response.data.error });
        else {
          console.log("Unknown error: ", err.response);
          setResponse({ success: false, error: "Unknown error occured" });
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <Root>
        <LoadingMessage>Creating Map...</LoadingMessage>
        <GlobalLoader />
      </Root>
    );
  }

  if (response.success === true) {
    return (
      <Root>
        <SuccessContainer>
          <Title>Map Created Successfully</Title>
        </SuccessContainer>
      </Root>
    );
  }

  return (
    <Root>
      {previewing && (
        <MapViewPopup>
          <MapView map={layout} />
          <CloseIcon src={closeIcon} onClick={() => setPreviewing(false)} />
        </MapViewPopup>
      )}
      <MapCreatorSettings
        handleChangeDimensions={handleChangeLayoutDimensions}
        handlePreview={() => setPreviewing(true)}
        handleCreate={handleCreate}
      />
      {response.error && <ErrorMessage>Error: {response.error}</ErrorMessage>}
      <Grid>{generateCells(layout, handleChangeLayout)}</Grid>
    </Root>
  );
};

export default MapCreator;
