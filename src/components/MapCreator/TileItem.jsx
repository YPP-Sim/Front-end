import React, { useContext } from "react";
import styled from "styled-components";
import northArrow from "../../SVGs/arrow-tile.svg";
import arrow90Deg from "../../SVGs/90deg_arrow.png";
import TileContext from "../../contexts/TileContext";

// Big Rocks
import bigRocks1 from "../../images/tiles/rocks_big_1.png";
import bigRocks2 from "../../images/tiles/rocks_big_2.png";
import bigRocks3 from "../../images/tiles/rocks_big_3.png";
import bigRocks4 from "../../images/tiles/rocks_big_4.png";

// Small Rocks
import smallRocks1 from "../../images/tiles/rocks_small_1.png";
import smallRocks2 from "../../images/tiles/rocks_small_2.png";
import smallRocks3 from "../../images/tiles/rocks_small_3.png";
import smallRocks4 from "../../images/tiles/rocks_small_4.png";

// Buoys
import buoy1 from "../../images/tiles/buoy_1.png";
import buoy2 from "../../images/tiles/buoy_2.png";
import buoy3 from "../../images/tiles/buoy_3.png";

const Root = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.backgroundColor || "#2d8bbe"};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid black;

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
    case 13:
      return bigRocks1;
    case 14:
      return bigRocks2;
    case 15:
      return bigRocks3;
    case 16:
      return bigRocks4;
    case 17:
      return buoy1;
    case 18:
      return buoy2;
    case 19:
      return buoy3;
    case 20:
      return smallRocks1;
    case 21:
      return smallRocks2;
    case 22:
      return smallRocks3;
    case 23:
      return smallRocks4;
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
