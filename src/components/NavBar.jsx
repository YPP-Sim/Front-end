import React from "react";
import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  color: white;
  background-color: rgba(0, 0, 0, 0);
  z-index: 100;
  transition: background-color 0.35s ease 0s;
  // background-color: #fbfbfb;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  margin: ${({ theme }) => theme.pageMargins};

  display: flex;
  justify-content: space-between;

  align-items: baseline;
  // padding: 20px 15px;
  width: 100%;
  max-width: 2000px;

  font-family: ${(props) => props.theme.textFont};

  margin-top: 130px;
`;

const TitleContainer = styled.div`
  font-size: 30px;
  font-weight: bold;
  text-shadow: 1px 2px #00000066;
};
`;

const SimContainer = styled.span``;

const LinksContainer = styled.nav`
  display: flex;

  a {
    text-decoration: none;
    // margin-left: 15px;
    font-size: 16px;
    padding: 7px;
    margin: 7px;

    color: #ffffffb0;
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
        {/* <TitleContainer>
          YPP-<SimContainer>SIM</SimContainer>
        </TitleContainer> */}
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
