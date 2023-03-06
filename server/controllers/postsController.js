const Post = require("../models/Post");
const User = require("../models/User");
const Tag = require("../models/Tag");
const mongoose = require("mongoose");

const createPost = async (req,res) => {
    const {id, caption, imgData, tags} = req.body
    const newPost = new Post({
        userId: id,
        desc: caption,
        img: imgData,
        tags: tags
    });
    try {
        const savedPost = await newPost.save();

        tags.map(async (t) => {
            await Tag.updateOne({"tag": t}, {$set:{"tag": t} }, {upsert: true})
        })

        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getAllPosts = async (req,res) => {
    try {
        const posts = await Post.find({}, '-__v')
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
}

const getPost = async (req,res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).lean();
        const author = await User.findById(post.userId, "_id username avatar").lean()
        const result = {...author, ...post}
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getPostsByCreator = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ userId: userId });
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
}

const getHomePosts = async (req,res) => {
    try {
        const user = await User.findById(req.params.userId)
        user.followings.push(user._id)
        const posts = await Post.find({ 'userId': { $in: user.followings } }).lean()
        const users = await User.find({ '_id': { $in: user.followings } }, "_id username avatar").lean()
        const author = users.map(({_id: userId, username, avatar})=>({userId, username, avatar}))
        const result = posts.map(p => ({...p, ...author.find(a => a.userId.toString() === p.userId)}))
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err);
    }
}

const getExplorePosts = async (req,res) => {
    try {
        const user = await User.findById(req.params.userId)
        user.followings.push(user._id)
        const posts = await Post.find({ 'userId': { $nin: user.followings } }, "-__v")/*.lean()*/
        /*const users = await User.find({ '_id': { $nin: user.followings } }, "_id username avatar").lean()
        const author = users.map(({_id: userId, username, avatar})=>({userId, username, avatar}))
        const result = posts.map(p => ({...p, ...author.find(a => a.userId.toString() === p.userId)}))*/
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
}

const getExploreTags = async (req,res) => {
    const {tag} = req.params
    try {
        const posts = await Post.find({ tags: { $elemMatch: { $eq: tag } } })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSavedPost = async (req,res) => {
    try {
        const user = await User.findById(req.params.userId)
        const posts = await Post.find({ '_id': { $in: user.saved } }, "-__v")
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err);
    }
}

const updatePost = async (req,res) => {
    const { id } = req.params;
    const { caption, imgData, tags } = req.body;
    console.log(id)
    const updatePost = {
        desc: caption,
        img: imgData,
        tags: tags,
        edited: true
    }
    try {
        const post = await Post.findByIdAndUpdate(id, updatePost, {new: true})

        tags.map(async (t) => {
            await Tag.updateOne({"tag": t}, {$set:{"tag": t} }, {upsert: true})
        })

        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err);
    }
}

const deletePost = async (req,res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndRemove(id)
        res.status(200).json(id)
    } catch (err) {
        res.status(500).json(err);
    }
}

const likePost = async (req,res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const post = await Post.findById(id);
        const index = post.likes.findIndex((id) => id ===String(userId));
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id) => id !== String(userId));
        }
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
}

const commentPost = async (req,res) => {
    const { id } = req.params;
    const { author, cmt } = req.body;
    const _id = new mongoose.Types.ObjectId();
    const date = new Date();
    const obj = {
            _id,
            userId: author,
            cmt: cmt,
            date,
        }
    try {
        const post = await Post.findById(id);
        post.comments.push(obj);
        await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json({id, obj});
    } catch (err) {
        res.status(500).json(err);
    }
}

const getCmt = async (req,res) => {
    const { id } = req.params;
    try {
        const cmt = await Post.findById(id).select('comments -_id').lean()
        let userId = cmt.comments.map(a => a.userId)
        const users = await User.find({ '_id': { $in: userId } }, "_id username avatar").lean()
        const author = users.map(({_id: userId, username, avatar})=>({userId, username, avatar}))
        const result = cmt.comments.map(c => ({...c, ...author.find(a => a.userId.toString() === c.userId)}))
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteCmt = async (req,res) => {
    const { id } = req.params;
    const { cmtId } = req.body;
    try {
        const cmt = await Post.findById(id)
        const deleteCmt = cmt.comments.filter((cmt) => cmt._id.toString() !== cmtId)
        await Post.findByIdAndUpdate(id, {comments: deleteCmt}, { new: true });
        res.status(200).json(cmtId);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getUserLike = async (req,res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
        const users = await User.find({ '_id': { $in: post.likes } }, "_id username avatar")
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    getPostsByCreator,
    getHomePosts,
    getExplorePosts,
    getExploreTags,
    getSavedPost,
    updatePost,
    deletePost,
    likePost,
    commentPost,
    getCmt,
    deleteCmt,
    getUserLike,
}