import {useSelector} from "react-redux";
import {getAuth} from "../redux/authSlice";

const useAuth = () => {
    return useSelector(getAuth)
}

export default useAuth