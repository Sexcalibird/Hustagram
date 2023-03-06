import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";

const initialState = {
    statistics: [],
    chart: null,
    users: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchStatistics = createAsyncThunk('admin/fetchStatistics', async (_,{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/admin`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchPerMonth = createAsyncThunk('admin/fetchPerMonth', async (_,{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/admin/perMonth`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchAllUsers = createAsyncThunk('admin/fetchAllUsers', async (_,{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/admin/users`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const deleteUser = createAsyncThunk('admin/deleteUser', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.delete(`/admin/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const banUser = createAsyncThunk('admin/banUser', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/admin/${id}/ban`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const editUser = createAsyncThunk('admin/editUser', async ({id, email, username, name, info},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/admin/${id}`, {email, username, name, info})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearStatistics() {
            return {...initialState}
        },
    },
    extraReducers(builder){
        builder

            .addCase(fetchStatistics.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.statistics = action.payload
            })

            .addCase(fetchPerMonth.fulfilled, (state, action) => {
                state.chart = action.payload
            })

            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(c => c._id !== action.payload)
            })

            .addCase(banUser.fulfilled, (state, action) => {
                const { _id } = action.payload;
                const users = state.users.filter(c => c._id !== _id);
                state.users = [...users, action.payload];
            })

            .addCase(editUser.fulfilled, (state, action) => {
                const { _id } = action.payload;
                const users = state.users.filter(c => c._id !== _id);
                state.users = [...users, action.payload];
            })
    }
})

export const getStatistics = (state) => state.admin.statistics
export const getChart = (state) => state.admin.chart
export const getAllUsers = (state) => state.admin.users
export const getUserByID = (state, id) => state.admin.users.find(user => user._id === id)
export const {clearStatistics} = adminSlice.actions
export default adminSlice.reducer