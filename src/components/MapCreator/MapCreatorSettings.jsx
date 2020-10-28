import React, { useState } from "react";
import styled from "styled-components";
import Button from "../ThemedButton";

const Root = styled.div`
  padding: 25px;
  border: 1px solid #eeeeee99;
  border-radius: 4px;
  //   display: flex;
  //   justify-content: space-between;
  margin-bottom: 25px;
`;

const Label = styled.label`
  color: #ffffff88;
  font-family: ${({ theme }) => theme.textFont};
  font-size: 15px;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  border: none;
  padding: 0px 15px;
  height: 35px;
  color: #222;
  background-color: white;
  outline: none;
  font-family: ${({ theme }) => theme.textFont};
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ThemedButton = styled(Button)`
  margin: 0;
  width: 100%;
  margin-right: 9px;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
  width: 100%;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 9px;
`;

const MapCreatorSettings = ({ handleChangeDimensions }) => {
  const [formData, setFormData] = useState({
    mapWidth: "",
    mapHeight: "",
    mapName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData);
  return (
    <Root>
      <FlexContainer>
        <InputContainer>
          <Label>Map Width:</Label>
          <InputField
            type="number"
            name="mapWidth"
            placeholder="width"
            value={formData.mapWidth}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <Label>Map Height:</Label>
          <InputField
            type="number"
            placeholder="height"
            name="mapHeight"
            value={formData.mapHeight}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <Label>Map Name:</Label>
          <InputField
            type="text"
            placeholder="My Map Name"
            name="mapName"
            value={formData.mapName}
            onChange={handleChange}
          />
        </InputContainer>
      </FlexContainer>

      <FlexContainer>
        <ThemedButton
          backgroundColor="#ffe259"
          onClick={() =>
            handleChangeDimensions(
              parseInt(formData.mapWidth),
              parseInt(formData.mapHeight)
            )
          }>
          Change size
        </ThemedButton>
        <ThemedButton backgroundColor="#F8b195">Preview</ThemedButton>
        <ThemedButton>Create</ThemedButton>
      </FlexContainer>
    </Root>
  );
};

export default MapCreatorSettings;
