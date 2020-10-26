import React, { useContext } from "react";
import styled from "styled-components";
import northArrow from "../../SVGs/arrow-tile.svg";
import arrow90Deg from "../../SVGs/90deg_arrow.png";
import TileContext from "../../contexts/TileContext";

const Root = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${(props) => props.backgroundColor || "#9CD4FF"};
  display: flex;
  align-items: center;
  justify-content: center;

  transform: rotate(${(props) => props.cssRotation || 0}deg)
    scaleX(${(props) => props.flip || 1});
`;

const IconImg = styled.img`
  width: 25px;
  height: 25px;
`;

function getIconById(cell_id) {
  switch (cell_id) {
    case 0:
      return;
    case 1:
    case 2:
    case 3:
    case 4:
      return northArrow;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return arrow90Deg;
    default:
      return;
  }
}

function getFlipById(cell_id) {
  switch (cell_id) {
    case 9:
    case 10:
    case 11:
    case 12:
      return -1;
    default:
      return 1;
  }
}

function getRotateById(cell_id) {
  switch (cell_id) {
    case 0:
    case 1:
      return 0;
    case 2:
    case 7:
    case 10:
      return 90;
    case 3:
    case 8:
    case 11:
      return 180;
    case 4:
    case 12:
      return 270;
    case 5:
      return -90;
    default:
      return 0;
  }
}

const TileItem = ({ cellId, onClick }) => {
  const { onSelect } = useContext(TileContext);

  const handleSelect = () => {
    onSelect(cellId);
  };

  return (
    <Root
      onClick={
        onClick !== null && onClick !== undefined ? onClick : handleSelect
      }
      cssRotation={getRotateById(cellId)}
      flip={getFlipById(cellId)}>
      {cellId !== 0 && <IconImg src={getIconById(cellId)} />}
    </Root>
  );
};

export default TileItem;
