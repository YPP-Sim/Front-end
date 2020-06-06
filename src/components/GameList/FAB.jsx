import React from "react";
import styled from "styled-components";

const Root = styled.div`
  width: ${(props) => props.width || "56px"};
  height: ${(props) => props.height || "56px"};
  background-color: ${(props) => props.backgroundColor || "#000000"};

  border-radius: 100%;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
`;

const FAB = () => {
  return <Root></Root>;
};

export default FAB;
