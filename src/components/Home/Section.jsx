import React from "react";

import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.backgroundColor || props.theme.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 0px;
  box-sizing: border-box;

  ${(props) =>
    props.dark
      ? `color: white;
    h2 {
        color: white;
        font-weight: 400;
    }
`
      : ""};
`;

const MaxWidthContainer = styled.div`
  max-width: ${({ theme }) => theme.pageMaxWidth};
  width: 100%;
`;

const ContentContainer = styled.div`
  margin: ${({ theme }) => theme.pageMargins};
`;

const Section = (props) => {
  return (
    <Root {...props}>
      <MaxWidthContainer>
        <ContentContainer>{props.children}</ContentContainer>
      </MaxWidthContainer>
    </Root>
  );
};

export default Section;
