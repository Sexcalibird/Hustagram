import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {useSelector} from "react-redux";
import {getToken} from "../../redux/authSlice";
import jwtDecode from "jwt-decode";
import useToken from "../../hooks/useToken";

const RequireAuth = ({ allowedRoles }) => {

    const {roles} = useToken();
    const location = useLocation();

    return (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;