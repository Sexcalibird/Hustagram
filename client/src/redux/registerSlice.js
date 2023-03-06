import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axios/axios";

const initialState = {
    success: false,
    error : null
}

export const signUp = createAsyncThunk('register/signUp',async ({email, user, pwd}, {rejectWithValue}) => {
    try {
        const response = await axios.post('/register', {email, user, pwd})
        return response.data
    } catch (err) {
        if (!err?.response) {
            return rejectWithValue('No Server Response');
        } else if (err.response?.status === 409) {
            return rejectWithValue('Email Taken');
        } else {
            return rejectWithValue('Registration Failed')
        }
    }
})

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
            .addCase(signUp.fulfilled,(state) => {
                state.success = true
            })
            .addCase(signUp.rejected, (state, action) => {
                state.error = action.payload
            })
    }
})

export const getError = (state) => state.register.error
export const getSuccess = (state) => state.register.success
export default registerSlice.reducer