import React from "react";
import styled from "styled-components";

const Root = styled.div`
  position: fixed;
  top: 0px;
  width: 100%;
  color: rgb(34, 34, 34);
  //   background-color: rgba(0, 0, 0, 0);
  z-index: 100;
  transition: background-color 0.35s ease 0s;
  background-color: #fbfbfb;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 1px 1px #4242422f;
`;

const Container = styled.div`
  margin: 0px 35px;

  display: flex;
  justify-content: space-between;

  align-items: baseline;
  padding: 20px 15px;
  width: 100%;
`;

const TitleContainer = styled.div`
  font-size: 23px;
`;

const SimContainer = styled.span``;

const LinksContainer = styled.nav`
  display: flex;

  a {
    text-decoration: none;
    // margin-left: 15px;
    // font-size: 17.5px;
    padding: 8px;
    margin: 8px;

    color: #333;
  }
`;

const NavBar = () => {
  return (
    <Root>
      <Container>
        <TitleContainer>
          YPP-<SimContainer>SIM</SimContainer>
        </TitleContainer>
        <LinksContainer>
          <a href="">Play Now</a>
          <a href="">About</a>
          <a href="">Github</a>
        </LinksContainer>
      </Container>
    </Root>
  );
};

export default NavBar;
