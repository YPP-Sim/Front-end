import React from "react";
import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  height: 1px;
  background-color: #bdbdbd;
  margin-bottom: ${(props) => props.mb};
  margin-top: ${(props) => props.mt};
`;

const Divider = (props) => {
  return <Root {...props}></Root>;
};

export default Divider;
