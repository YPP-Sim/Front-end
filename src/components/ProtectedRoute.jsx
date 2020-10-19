import React, {useContext} from 'react';
import UserContext from "../contexts/UserContext";
import {Redirect, Route} from "react-router-dom";
import {getAccessToken} from "../util/TokenStorage";

const ProtectedRoute = ({children, ...rest}) => {
    const {loggedIn} = useContext(UserContext);
    return ( <Route {...rest} >
        {getAccessToken() || loggedIn ? children : (
            <Redirect to="/login" />
        )}
    </Route> );
}
 
export default ProtectedRoute;