import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";

const initialState = {
    chat: [],
    messages: null,
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const addNewChat = createAsyncThunk('chat/addNewChat', async ({userId1, userId2},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post(`/chat`, {userId1, userId2})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getChatList = createAsyncThunk('chat/getChatList', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/chat/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getChat = createAsyncThunk('chat/getChat', async ({userId1, userId2},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/chat/${userId1}/${userId2}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const newMessage = createAsyncThunk('chat/newMessage', async ({id, userId, mess},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post(`/chat/${id}`, {userId, mess})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        clearChat() {
            return {...initialState}
        },
        receiveMess(state, action) {
            state.messages.messages.push(action.payload)
        }
    },
    extraReducers(builder){
        builder

            .addCase(addNewChat.fulfilled, (state, action) => {
                state.chat.push(action.payload)
            })

            .addCase(getChatList.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getChatList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.chat = action.payload
            })

            .addCase(getChat.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getChat.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.messages = action.payload
            })

            .addCase(newMessage.fulfilled, (state, action) => {
                state.messages.messages.push(action.payload)
            })

    }
})

export const getChats = (state) => state.chat.chat
export const getMess = (state) => state.chat.messages
export const getChatStatus = (state) => state.chat.status
export const {clearChat, receiveMess} = chatSlice.actions
export default chatSlice.reducer