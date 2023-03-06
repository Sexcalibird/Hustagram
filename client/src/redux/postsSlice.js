import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {axiosPrivate} from "../axios/axios";

const initialState = {
    posts: [],
    post: null,
    cmt: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const addNewPost = createAsyncThunk('posts/addNewPost', async ({id, caption, imgData, tags},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post('/posts', {id, caption, imgData, tags})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchPostDetail = createAsyncThunk('posts/fetchPostDetail', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/p/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchHomePosts = createAsyncThunk('posts/fetchHomePosts', async ({userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/home/${userId}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchExplorePosts = createAsyncThunk('posts/fetchExplorePosts', async ({userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/explore/${userId}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchExploreTags = createAsyncThunk('posts/fetchExploreTags', async ({tag},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/explore/tags/${tag}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchProfilePosts = createAsyncThunk('posts/fetchProfilePosts', async ({userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/${userId}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchSavedPost = createAsyncThunk('posts/fetchSavedPost', async ({userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/saved/${userId}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const likePost = createAsyncThunk('posts/likePost', async ({id, userId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/posts/${id}/like`, {userId})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const getUserLike = createAsyncThunk ('posts/getUserLike', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/${id}/like/list`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const updatePost = createAsyncThunk('posts/updatePost', async ({id, caption, imgData, tags},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/posts/${id}`, {caption, imgData, tags})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.delete(`/posts/${id}`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const addCmt = createAsyncThunk('posts/addCmt', async ({id, author, cmt},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post(`/posts/${id}/comment`, {author, cmt})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchCmt = createAsyncThunk('posts/fetchCmt', async ({id},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`/posts/${id}/comment`)
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const deleteCmt = createAsyncThunk('posts/deleteCmt', async ({id, cmtId},{rejectWithValue}) => {
    try {
        const response = await axiosPrivate.patch(`/posts/${id}/comment`, {cmtId})
        return response.data
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reset(state) {
            state.post = null
        },
        clearPosts() {
            return {...initialState}
        }
    },
    extraReducers(builder){
        builder

            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
            .addCase(addNewPost.rejected, (state, action) => {
                state.error = action.err.message
            })

            .addCase(fetchPostDetail.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.post = action.payload
            })
            .addCase(fetchPostDetail.rejected, (state, action) => {
                state.status = 'rejected'
            })

            .addCase(fetchHomePosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchHomePosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })

            .addCase(fetchExplorePosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchExplorePosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })

            .addCase(fetchExploreTags.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchExploreTags.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })

            .addCase(fetchProfilePosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProfilePosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })

            .addCase(fetchSavedPost.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchSavedPost.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })

            .addCase(likePost.fulfilled, (state, action) => {
                const { _id, likes } = action.payload;
                if (state.posts.length > 0) {
                    const post = state.posts.findIndex(post => post._id === _id);
                    state.posts[post].likes = likes
                }
                if (state.post !== null) {
                    state.post.likes = likes
                }
            })

            .addCase(updatePost.fulfilled, (state, action) => {
                const { _id, desc, img, tags } = action.payload;
                if (state.posts.length > 0) {
                    const post = state.posts.findIndex(post => post._id === _id);
                    state.posts[post].desc = desc
                    state.posts[post].img = img
                    state.posts[post].tags = tags
                    state.posts[post].edited = true
                }
                if (state.post !== null) {
                    state.post.desc = desc
                    state.post.img = img
                    state.post.tags = tags
                    state.post.edited = true
                }
            })

            .addCase(deletePost.fulfilled, (state,action) => {
                state.posts = state.posts.filter(p => p._id !== action.payload)
            })

            .addCase(addCmt.fulfilled, (state, action) => {
                const { id, obj } = action.payload;
                if (state.posts.length > 0) {
                    const post = state.posts.findIndex(post => post._id === id);
                    state.posts[post].comments.push(obj)
                }
                state.cmt.push(obj)
            })

            .addCase(fetchCmt.fulfilled, (state, action) => {
                state.cmt = action.payload
            })

            .addCase(deleteCmt.fulfilled, (state, action) => {
                state.cmt = state.cmt.filter(c => c._id !== action.payload)
            })

    }
})

export const getPosts = (state) => state.posts.posts
export const getPost = (state) => state.posts.post
export const getCmt = (state) => state.posts.cmt
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getPostsbyID = (state, postID) => state.posts.posts.find(post => post._id === postID)
export const {reset, clearPosts} = postsSlice.actions
export default postsSlice.reducer