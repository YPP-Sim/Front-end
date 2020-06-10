import React from "react";
import styled from "styled-components";
import wfImg from "../../assets/ships/wf.png";
import wbImg from "../../assets/ships/wb.png";
// import junkImg from "../../assets/ships/junk.png"
// import xebecImg from "../../assets/ships/xebec.png"

const Root = styled.div`
  width: 100%;
  background-color: #fff;
  height: 120px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
`;

const ShipImage = styled.img`
  width: 50px;
  object-fit: contain;
`;

const PlayerName = styled.h3`
  font-family: ${({ theme }) => theme.titleFont};
  font-size: 17px;
  color: ${({ theme }) => theme.textColor};
  font-weight: normal;
  margin: 0;
  margin-bottom: 10px;
  margin-right: 5px;
`;

function getShipImageFromType(type) {
  switch (type) {
    case "WAR_FRIG":
      return wfImg;
    case "WAR_BRIG":
      return wbImg;
    default:
      return "";
  }
}

const PlayerCard = ({ shipType, name }) => {
  return (
    <Root>
      <PlayerName>{name}</PlayerName>
      <ShipImage src={getShipImageFromType(shipType)} />
    </Root>
  );
};

export default PlayerCard;
