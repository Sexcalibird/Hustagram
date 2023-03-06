import axios from '../axios/axios';
import {refreshToken} from "../redux/authSlice";
import {useDispatch} from "react-redux";

const useRefreshToken = () => {
    const dispatch = useDispatch()
    return async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        dispatch(refreshToken(response.data.accessToken))
        return response.data.accessToken;
    }
};

export default useRefreshToken;