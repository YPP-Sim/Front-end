import React, {useContext} from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import LinksDropdown from "./LinksDropdown/LinksDropdown";
import UserContext from "../contexts/UserContext";
import LinkItem from "./LinksDropdown/LinkItem";

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
const LinkText = styled.p`
  margin: 0;
  padding: 0;

  margin-left: 15px;
`;


const NavBar = () => {
  const {username, loggedIn, logout} = useContext(UserContext);
  const history = useHistory();

  return (
    <Root>
      <Container>
        <Link to="/">
          <NavTitle>YPP-SIM</NavTitle>
        </Link>
        <LinksContainer>
        <Link to="/">Home</Link>
          <Link to="/patchnotes">News</Link>
          {/* <a href="">About</a> */}
          <a href="https://github.com/YPP-Sim">Github</a>
          {loggedIn ? (
            <LinksDropdown title={username}>
              <LinkItem onClick={() => history.push("/account-settings")}><LinkText>Settings</LinkText></LinkItem>
              <LinkItem onClick={logout}><LinkText>Logout</LinkText></LinkItem>
            </LinksDropdown>

          ) : (
            <Link to="/login">Login</Link>
          )}
        </LinksContainer>
      </Container>
    </Root>
  );
};

export default NavBar;
