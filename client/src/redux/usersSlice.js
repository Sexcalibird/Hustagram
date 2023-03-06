import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";
import {getUserLike} from "./postsSlice";

const initialState = {
    users: null,
    suggestions: null,
    profile: null,
    status: 'idle',
    error: null,
}

export const fetchUser = createAsyncThunk('users/fetchUser',async ({username},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/users/${username}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const followUser = createAsyncThunk('users/followUser', async ({id, userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/users/${id}/follow`, {userId})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const savePost = createAsyncThunk('users/savePost', async ({id, postId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/users/${id}/save`, {postId})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const updateUser = createAsyncThunk('users/updateUser', async ({id, username, name, info},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/users/${id}/edit`, {username, name, info})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const updateAvatar = createAsyncThunk('users/updateAvatar', async ({id, avatar},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/users/${id}/ava`, {avatar})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const updatePwd = createAsyncThunk('users/updatePwd', async ({id, oldPwd, newPwd},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/users/${id}/pwd`, {oldPwd, newPwd})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getSuggestion = createAsyncThunk('users/getSuggestion', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/users/${id}/suggestion`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getFollowers = createAsyncThunk('users/getFollowers', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/users/${id}/followers`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getFollowings = createAsyncThunk('users/getFollowings', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/users/${id}/followings`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsers() {
            return {...initialState}
        }
    },
    extraReducers(builder){
        builder

            .addCase(fetchUser.fulfilled,(state,action) => {
                state.profile = action.payload
            })
            .addCase(fetchUser.rejected,(state, action) => {
                console.log(action.err.message)
            })

            .addCase(followUser.fulfilled, (state,action) => {
                state.profile = action.payload.updatedProfile
            })

            .addCase(getSuggestion.fulfilled, (state, action) => {
                state.suggestions = action.payload
            })

            .addCase(getFollowers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })

            .addCase(getFollowings.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getFollowings.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })

            .addCase(getUserLike.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getUserLike.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })

    }
})

export const getUsers = (state) => state.users.users
export const getProfile = (state) => state.users.profile
export const getSuggestions = (state) => state.users.suggestions
export const getStatus = (state) => state.users.status
export const getError = (state) => state.users.error
export const {clearUsers} = usersSlice.actions
export default usersSlice.reducer