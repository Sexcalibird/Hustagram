import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";

const initialState = {
    notifications: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const getNotification = createAsyncThunk('notification/getNotification', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/notification/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const newNotification = createAsyncThunk('notification/newNotification', async ({id, postId, userId, text},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post(`/notification/${id}`, {postId, userId, text})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        receiveNews(state, action) {
            state.notifications.push(action.payload)
        }
    },
    extraReducers(builder){
        builder

            .addCase(getNotification.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getNotification.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.notifications = action.payload
            })

    }
})

export const getNotifications = (state) => state.notification.notifications
export const getNtfcStatus = (state) => state.notification.status
export const {receiveNews} = notificationSlice.actions
export default notificationSlice.reducer