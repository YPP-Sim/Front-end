import React from "react";
import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  color: #333;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  height: fit-content;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  // margin: ${({ theme }) => theme.pageMargins};
  margin: 0px 76.5px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  max-width: ${({ theme }) => theme.pageMaxWidth};
  font-family: ${(props) => props.theme.textFont};
  margin-top: 80px;
`;

const LinksContainer = styled.div`
  display: flex;

  a {
    text-decoration: none;
    font-size: 16px;
    padding: 7px;
    margin: 7px;
    color: #494949;
    text-transform: uppercase;

    &:hover {
      color: white;
      text-shadow: 1px 2px #00000066;
    }
  }
`;

const NavBar = () => {
  return (
    <Root>
      <Container>
        <LinksContainer>
          <a href="">Play</a>
          <a href="">About</a>
          <a href="https://github.com/YPP-Sim">Github</a>
        </LinksContainer>
      </Container>
    </Root>
  );
};

export default NavBar;
