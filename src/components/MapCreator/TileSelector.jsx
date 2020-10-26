import React from "react";
import styled from "styled-components";
import popup from "../../styled-animations/popup";
import TileItem from "./TileItem";
import { TileProvider } from "../../contexts/TileContext";
import closeImg from "../../SVGs/close_icon.svg";

const Root = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(2, 30px);
  grid-template-rows: repeat(auto-fill, 30px);
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #242424;
  top: 42px;
  left: 5px;

  z-index: 50;

  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);

  animation: ${popup} 0.2s ease-out;
`;

const ArrowPointer = styled.div`
  position: absolute;

  clip-path: polygon(50% 0, 0% 100%, 100% 100%);
  width: 17px;
  height: 10px;
  background-color: #242424;

  top: -10px;
  left: 20px;

  transform: translateX(-50%);
`;

const CloseIcon = styled.img`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 12px;
  height: 12px;
  cursor: pointer;
`;

const TileSelector = ({ onSelect, onClose }) => {
  return (
    <TileProvider value={{ onSelect }}>
      <Root>
        <ArrowPointer />
        <CloseIcon onClick={onClose} src={closeImg} />
        <TileItem cellId={0} />
        <TileItem cellId={0} />
        <TileItem cellId={1} />
        <TileItem cellId={2} />
        <TileItem cellId={4} />
        <TileItem cellId={3} />
        <TileItem cellId={7} />
        <TileItem cellId={8} />
        <TileItem cellId={6} />
        <TileItem cellId={5} />

        <TileItem cellId={11} />
        <TileItem cellId={12} />
        <TileItem cellId={10} />
        <TileItem cellId={9} />
      </Root>
    </TileProvider>
  );
};

export default TileSelector;
