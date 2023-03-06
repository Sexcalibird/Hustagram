import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";

const initialState = {
    search: [],
    history: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchSearch = createAsyncThunk('search/fetchSearch', async ({search},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/search?search=${search}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const addHistory = createAsyncThunk('search/addHistory', async ({id, history},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post(`/search/history/${id}`, {history})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getHistory = createAsyncThunk('search/getHistory', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/search/history/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const deleteHistory = createAsyncThunk('search/deleteHistory', async ({id, history},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/search/history/${id}`, {history})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch() {
            return {...initialState}
        }
    },
    extraReducers(builder){
        builder

            .addCase(fetchSearch.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.search = action.payload
            })

            .addCase(getHistory.fulfilled, (state, action) => {
                state.history = action.payload
            })

            .addCase(deleteHistory.fulfilled, (state, action) => {
                state.history = state.history.filter((h) => h.userId !== action.payload && h.tag !== action.payload)
            })
    }
})

export const getSearch = (state) => state.search.search
export const getSearchHistory = (state) => state.search.history
export const getSearchStatus = (state) => state.search.status
export const {clearSearch} = searchSlice.actions
export default searchSlice.reducer