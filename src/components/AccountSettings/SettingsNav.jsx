import React, {useContext} from "react";
import UserContext from "../../contexts/UserContext";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { links } from "./AccountSettingsPage";
import FormButton from "../Forms/SubmitButton";

const Root = styled.div`
    
    background-color: rgba(100,100,100 ,0.2);
    padding: 30px;
    min-width: 300px;
    box-sizing: border-box;

    height: 100%;
    min-height: 600px;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const NavTitle = styled.h2`
    font-family: ${({theme}) => theme.textFont};
    color: ${({theme}) => theme.textColor};
    text-align: center;
    margin: 0;
    padding: 15px 0px 25px 0px;

    border-bottom: 1px solid rgba(125,125,125,0.6);
`;

const Links = styled.div`
display: block;
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;

    height: 100%;
`;

const NavLink = styled(Link)`
    background-color: ${(props) => props.selected ? "#22222244" : ""};
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    color: ${({theme}) => theme.textColor};
    font-family: ${({theme}) => theme.textFont};
    font-size: 17px;
    text-decoration: none;

    display: block;

    &:hover {
        background-color: ${(props) => props.selected ? "" : "#33333344"};
    }
`;

const Button = styled(FormButton)`
    background-color: #e64539;
    box-shadow: none;
    color: white;

    height: 50px;

    &:hover {
        background-color: #b7372d;
    }
`


const SettingsNav = ({ selected }) => {
    const { logout } = useContext(UserContext);
  return <Root>
      <div>
        <NavTitle>YPP-SIM</NavTitle>  
        <Links>
        {links.map((linkObj, key) => (
            <NavLink 
            selected={selected === linkObj.route} 
            to={`/account-settings/${linkObj.route}`}
            key={key} >
                {linkObj.title}
            </NavLink>
        ))}
        </Links>
      </div>

      <Button onClick={() => logout()}>Logout</Button>
    </Root>;
};

export default SettingsNav;
