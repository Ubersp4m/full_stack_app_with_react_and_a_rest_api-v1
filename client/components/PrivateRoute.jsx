import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
    const { authUser } = useContext(UserContext);
    const location = useLocation();
    console.log(location);
    if(authUser){
        return <Outlet />
    }
    //if not authenticated, redirect to sign-in page sending the current location in state
    else{
        return <Navigate to="/signin" state = {{from: location.pathname}}/>
    }

}

export default PrivateRoute;