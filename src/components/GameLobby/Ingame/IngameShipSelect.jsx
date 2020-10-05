import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../Button";
import OptionSelectButton from "./OptionSelectButton";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
  box-sizing: border-box;
`;

const Selections = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  margin-bottom: 20px;

  @media (max-width: 705px) {
    flex-direction: column;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.textFont};
  color: ${({ theme }) => theme.textColor};
  font-size: 21px;
  font-weight: normal;
  text-align: center;

  user-select: none;
`;

const ShipSelectContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);

  width: 100%;
`;

const SideSelectContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const Divider = styled.div`
  background: rgba(255, 255, 255, 0.4);
  height: 130px;
  width: 1px;
  margin: 0px 25px;

  @media (max-width: 705px) {
    width: 100px;
    height: 1px;
    margin: 25px 0px;
  }
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

  padding: 10px;
  box-sizing: border-box;
`;

const IngameShipSelect = ({ socket, playerName, gameId }) => {
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedSide, setSelectedSide] = useState("");

  const handleConfirm = () => {
    // Send packet to join game with selected ship type and side
    socket.emit("playerJoinConfig", {
      gameId,
      playerName,
      chosenShipType: selectedShip,
      chosenSide: selectedSide,
    });
  };

  return (
    <Root>
      <Selections>
        <ShipSelectContainer>
          <Title>Select ship</Title>
          <ButtonContainer>
            <OptionSelectButton
              onClick={() => setSelectedShip("WAR_FRIG")}
              active={selectedShip === "WAR_FRIG"}
            >
              War Frig
            </OptionSelectButton>
            <OptionSelectButton
              onClick={() => setSelectedShip("WAR_BRIG")}
              active={selectedShip === "WAR_BRIG"}
            >
              War Brig
            </OptionSelectButton>
          </ButtonContainer>
        </ShipSelectContainer>
        <Divider />
        <SideSelectContainer>
          <Title>Select side</Title>
          <ButtonContainer>
            <OptionSelectButton
              onClick={() => setSelectedSide("ATTACKER")}
              active={selectedSide === "ATTACKER"}
            >
              Attacker
            </OptionSelectButton>
            <OptionSelectButton
              onClick={() => setSelectedSide("DEFENDER")}
              active={selectedSide === "DEFENDER"}
            >
              Defender
            </OptionSelectButton>
          </ButtonContainer>
        </SideSelectContainer>
      </Selections>
      <Button
        onClick={handleConfirm}
        borderRadius="4px"
        fontSize="16px"
        width="100%"
        noShadow
        disabled={selectedShip === "" || selectedSide === ""}
      >
        Join Game
      </Button>
    </Root>
  );
};

export default IngameShipSelect;
