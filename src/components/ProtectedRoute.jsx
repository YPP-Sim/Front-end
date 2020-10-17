import React, {useContext} from 'react';
import {Redirect, Route} from "react-router-dom";
import UserContext from "../contexts/UserContext";

const ProtectedRoute = ({children, ...rest}) => {
    const { loggedIn } = useContext(UserContext);
    return ( <Route {...rest} >
        {loggedIn ? children : (
            <Redirect to="/login" />
        )}
    </Route> );
}
 
export default ProtectedRoute;