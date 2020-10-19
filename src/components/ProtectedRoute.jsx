import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {getAccessToken} from "../util/TokenStorage";

const ProtectedRoute = ({children, ...rest}) => {
    return ( <Route {...rest} >
        {getAccessToken() ? children : (
            <Redirect to="/login" />
        )}
    </Route> );
}
 
export default ProtectedRoute;