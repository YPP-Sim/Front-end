import React from "react";
import styled from "styled-components";

const Root = styled.div`
  background: rgba(196, 196, 196, 0.05);

  padding: 0px ${({ theme }) => theme.pageMargins};

  padding-bottom: 143px;
  @media (max-width: 1024px) {
    padding: 0px ${({ theme }) => theme.pageMarginsTablet};
    padding-bottom: 143px;
  }
`;

const HomeContent = ({ children }) => {
  return <Root>{children}</Root>;
};

export default HomeContent;
