import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import dropdownArrow from "../../SVGs/dropdown_arrow.svg";

const Root = styled.div`
  background: rgba(
    196,
    196,
    196,
    ${(props) => (props.isThisPlayer ? "0.5" : "0.25")}
  );
  border-radius: 6px;
  padding: 10px 22px;
  box-sizing: border-box;
  width: 50%;
  margin-left: 16px;

  position: relative;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.4" : "1.0")};
`;

const DisplayText = styled.p`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;

  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  padding: 0;
`;

const DropDownItem = styled.div`
  width: 100%;
  height: 29px;
  padding: 8px 22px;
  box-sizing: border-box;
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: pointer;

  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.75);

  &:hover {
    background: #a4a6a9;
  }
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 6px;
`;

const DisplayTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropDownMenu = styled.div`
  width: 100%;
  position: absolute;
  top: 39px;
  left: 0;

  background: #83888e;

  z-index: 20;
  padding-bottom: 10px;
  padding-top: 8px;
  border-radius: 0px 0px 6px 6px;
`;

function getServerItemFromSelect(selectedIndex) {
  switch (selectedIndex) {
    case 0:
      return "WAR_FRIG";
    case 1:
      return "WAR_FRIG";
    case 2:
      return "WAR_BRIG";
    case 3:
      return "XEBEC";
    default:
      return "WAR_FRIG";
  }
}

const ShipSelection = ({
  onSelect,
  disabled,
  hideArrow,
  defaultSelected,
  isThisPlayer,
}) => {
  const [isSelecting, setSelecting] = useState(false);
  // Selected index
  const [selected, setSelected] = useState(0);
  // Select list
  const [selectList] = useState([
    "Choose Ship",
    "War Frig",
    "War Brig",
    // "Xebec",
  ]);

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, []);

  const onDropDown = () => {
    if (!disabled) setSelecting(!isSelecting);
  };

  const onSelectItem = (itemIndex) => {
    onSelect(getServerItemFromSelect(itemIndex));
    setSelected(itemIndex);
    setSelecting(false);
  };

  return (
    <Root isThisPlayer={isThisPlayer} onClick={onDropDown} disabled={disabled}>
      <DisplayTextContainer>
        <DisplayText>{selectList[selected]}</DisplayText>
        {isThisPlayer && <ArrowIcon src={dropdownArrow} />}
      </DisplayTextContainer>
      {isSelecting && (
        <DropDownMenu>
          {selectList.map((item, index) => {
            if (index === 0) return;
            return (
              <DropDownItem key={index} onClick={() => onSelectItem(index)}>
                {item}
              </DropDownItem>
            );
          })}
        </DropDownMenu>
      )}
    </Root>
  );
};

export default ShipSelection;
