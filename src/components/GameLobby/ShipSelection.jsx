import React, { useState } from "react";
import styled from "styled-components";
import wfImg from "../../assets/ships/wf.png";
import wbImg from "../../assets/ships/wb.png";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
`;

const ShipCard = styled.div`
  background-color: ${(props) =>
    props.selected ? props.theme.accentColor : "#777"};
  opacity: ${(props) => (props.selected ? 1.0 : 0.6)};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 7px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    opacity: 1;
  }
`;

const ShipIcon = styled.img``;

const ShipSelection = ({ onSelect }) => {
  const [selected, setSelected] = useState(-1);
  return (
    <Root>
      <ShipCard
        selected={selected === 0}
        onClick={
          selected !== 0
            ? () => {
                onSelect("WAR_FRIG");
                setSelected(0);
              }
            : () => {}
        }
      >
        <ShipIcon src={wfImg} />
      </ShipCard>

      <ShipCard
        selected={selected === 1}
        onClick={
          selected !== 1
            ? () => {
                onSelect("WAR_BRIG");
                setSelected(1);
              }
            : () => {}
        }
      >
        <ShipIcon src={wbImg} />
      </ShipCard>
    </Root>
  );
};

export default ShipSelection;
