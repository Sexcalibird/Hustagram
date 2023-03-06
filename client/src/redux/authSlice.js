import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axios/axios";
import {followUser, savePost, updateAvatar, updateUser} from "./usersSlice";
import {addHistory} from "./searchSlice";

const initialState = {
    auth: null,
    accessToken: null,
    error : null
}

export const signIn = createAsyncThunk('auth/signIn',async ({email, pwd}, {rejectWithValue}) => {
    try {
        const response = await axios.post('/auth', {email, pwd}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        return response.data
    } catch (err) {
        if (!err?.response) {
            return rejectWithValue('No Server Response');
        } else if (err.response?.status === 400) {
            return rejectWithValue('Missing Email or Password');
        } else if (err.response?.status === 401) {
            return rejectWithValue('Unauthorized')
        } else if (err.response?.status === 500) {
            return rejectWithValue('Banned')
        } else {
            return rejectWithValue('Login Failed')
        }
    }
})

export const signOut = createAsyncThunk('auth/signOut',async () => {
    try {
        const response = await axios.get('/logout', {
            withCredentials: true
        });
        return response.status
    } catch (err) {
        console.error(err);
    }
})



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        refreshToken: (state, action) => {
            state.accessToken = action.payload
        },
    },
    extraReducers(builder){
        builder
            .addCase(signIn.fulfilled,(state,action) => {
                state.auth = action.payload.auth
                state.accessToken = action.payload.accessToken
                state.error = null
            })
            .addCase(signIn.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(signOut.fulfilled,() => {
                return { ...initialState }
            })

            .addCase(followUser.fulfilled, (state, action) => {
                state.auth = action.payload.updatedUser
            })

            .addCase(savePost.fulfilled, (state, action) => {
                const {saved} = action.payload
                state.auth.saved = saved
            })

            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.auth = action.payload
            })

            .addCase(updateUser.fulfilled, (state, action) => {
                state.auth = action.payload
            })

            .addCase(addHistory.fulfilled, (state, action) => {
                state.auth = action.payload
            })
    }
})

export const getAuth = (state) => state.auth.auth
export const getToken = (state) => state.auth.accessToken
export const getError = (state) => state.auth.error
export const {refreshToken} = authSlice.actions
export default authSlice.reducer