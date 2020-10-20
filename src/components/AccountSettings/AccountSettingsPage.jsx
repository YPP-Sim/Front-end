import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SettingsNav from "./SettingsNav";
import { Route, useLocation} from "react-router-dom";
import AccountDetailsView from "./Views/AccountDetailsView";
import SecurityView from "./Views/SecurityView";

// Links connected with routes and a view component
export const links = [
  {
      route: "profile",
      title: "Profile",
      viewComponent: <AccountDetailsView />
  },
  {
    route: "security",
    title: "Security",
    viewComponent: <SecurityView />
}
]

//Styled components
const Root = styled.div`
    display: flex;
    margin-top: 50px;
    padding: 50px;
    box-sizing: border-box;
    justify-content: center;
`;

const SettingsView = styled.div`
    background-color: #222222aa;
    display: block;
    width: 100%;

    box-sizing: border-box;
    padding: 30px;

    color: ${({theme}) => theme.textColor};

    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

    max-width: 1000px;
    `;

const AccountSettingsPage = () => {
  const [selected, setSelected] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const pathArray = location.pathname.split("/");
    const selectedPath = pathArray[pathArray.length - 1];
    setSelected(selectedPath);
  }, [location]);


  return <Root>
    <SettingsNav selected={selected} />
    <SettingsView>

      {links.map((linkObj, key) => (
        <Route exact path={`/account-settings/${linkObj.route}`} key={key}>
          {linkObj.viewComponent}
        </Route>
      ))}

    </SettingsView>
  </Root>;
};

export default AccountSettingsPage;
