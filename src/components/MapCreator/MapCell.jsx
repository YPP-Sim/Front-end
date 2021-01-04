import React, { useState } from "react";
import styled from "styled-components";
import TileItem from "./TileItem";
import TileSelector from "./TileSelector";

const Root = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  position: relative;

  cursor: pointer;
`;

const MapCell = ({ x, y, cellId, onChangeLayout }) => {
  const [selecting, setSelecting] = useState(false);

  const handleSelect = (id) => {
    onChangeLayout(x, y, id);
    setSelecting(false);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setSelecting(false);
  };

  return (
    <Root>
      {selecting && (
        <TileSelector onSelect={handleSelect} onClose={handleClose} />
      )}
      <TileItem onClick={() => setSelecting(true)} cellId={cellId} />
    </Root>
  );
};

export default MapCell;
