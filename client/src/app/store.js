import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import registerReducer from "../redux/registerSlice";
import usersReducer from "../redux/usersSlice";
import postsReducer from "../redux/postsSlice";
import searchReducer from "../redux/searchSlice";
import chatReducer from "../redux/chatSlice";
import notificationReducer from "../redux/notificationSlice";
import adminReducer from "../redux/adminSlice";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        register: registerReducer,
        users: usersReducer,
        posts: postsReducer,
        search: searchReducer,
        chat: chatReducer,
        notification: notificationReducer,
        admin: adminReducer,
    }
})