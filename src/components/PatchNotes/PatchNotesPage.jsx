import React from "react";
import styled from "styled-components";
import patchData from "../../patchnotes";
import PatchNotes from "./PatchNotes";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PatchNotesPage = () => {
  return (
    <Root>
      {patchData.map((patch, index) => (
        <PatchNotes data={patch} key={index} />
      ))}
    </Root>
  );
};

export default PatchNotesPage;
