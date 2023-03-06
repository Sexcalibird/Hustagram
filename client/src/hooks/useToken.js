import {useSelector} from "react-redux";
import {getToken} from "../redux/authSlice";
import jwtDecode from "jwt-decode";

const useToken = () => {
    const token = useSelector(getToken)
    if (token) {
        const decoded = jwtDecode(token)
        const { id, email, roles } = decoded.UserInfo
        return { id, email, roles }
    }
    return { id: '', email: '', roles: []}
}

export default useToken