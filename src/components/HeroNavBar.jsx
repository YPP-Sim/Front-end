import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Root = styled.div`
  width: 100%;
  color: #333;
  display: flex;
  height: fit-content;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  margin: 0px 76.5px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  max-width: ${({ theme }) => theme.pageMaxWidth};
  font-family: ${(props) => props.theme.textFont};
  margin-top: 45px;

  & a {
    text-decoration: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;

  a {
    text-decoration: none;
    margin-left: 40px;

    font-family: ${({ theme }) => theme.textFont};
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.textColor};
    user-select: none;
    &:hover {
      color: ${({ theme }) => theme.accentColor};
    }
  }
`;

const NavTitle = styled.h3`
  font-family: ${({ theme }) => theme.titleFont};
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 28px;
  user-select: none;

  color: ${({ theme }) => theme.textColor};
`;

const NavBar = () => {
  return (
    <Root>
      <Container>
        <Link to="/">
          <NavTitle>YPP-SIM</NavTitle>
        </Link>
        <LinksContainer>
          <Link to="/patchnotes">News</Link>
          {/* <a href="">About</a> */}
          <a href="https://github.com/YPP-Sim">Github</a>
        </LinksContainer>
      </Container>
    </Root>
  );
};

export default NavBar;
