import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  height: 60px;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

const LinksContainer = styled.nav`
  a {
    color: ${({ theme }) => theme.textColor};
    text-decoration: none;
    font-family: ${({ theme }) => theme.textFont};

    padding: 7px;
    margin: 7px;

    &:hover {
      border-bottom: 1px solid black;
    }
  }
`;

const NavBar = () => {
  return (
    <Root>
      <LinksContainer>
        <Link to="/">Home</Link>
        <Link to="/games">Game List</Link>
        <a href="https://github.com/YPP-Sim">Github</a>
      </LinksContainer>
    </Root>
  );
};

export default NavBar;
