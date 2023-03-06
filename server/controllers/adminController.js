const Post = require("../models/Post");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Notification = require("../models/Notification");

const getStatistics = async (req,res) => {
    try {
        const countUsers = await User.countDocuments()
        const countPosts = await Post.countDocuments()
        const countLikes = await Post.aggregate([{
            $group: {
                _id: null,
                total: { $sum: { $size:"$likes" } }
            }}])
        const countCmts = await Post.aggregate([{
            $group: {
                _id: null,
                total: { $sum: { $size:"$comments" } }
            }}])
        res.status(200).json({countUsers, countPosts, countLikes, countCmts});
    } catch (err) {
        res.status(500).json(err);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

const getPerMonth = async (req,res) => {
    const start = new Date("2022-10-21");
    const today = new Date("2024-10-21");
    try {
        const users = await User.aggregate([
            { "$match": {
                    "createdAt": { "$gte": start, "$lt": today }
                }},
            { "$group": {
                    "_id": {
                        "year": { "$year": "$createdAt" },
                        "month": { "$month": "$createdAt" },
                    },
                    "count": { "$sum": 1 }
                }}
        ])
        const posts = await Post.aggregate([
            { "$match": {
                    "createdAt": { "$gte": start, "$lt": today }
                }},
            { "$group": {
                    "_id": {
                        "year": { "$year": "$createdAt" },
                        "month": { "$month": "$createdAt" },
                    },
                    "count": { "$sum": 1 }
                }}
        ])
        res.status(200).json({users, posts});
    } catch (err) {
        res.status(400).json(err.message);
    }
}

const deleteUser = async (req,res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndRemove(id)
        await Post.deleteMany({userId: id})
        await Notification.deleteOne({userId: id})
        await User.updateMany({},{ $pull: { followers: id } }, {new: true})
        await User.updateMany({},{ $pull: { followings: id } }, {new: true})
        await Post.updateMany({},{ $pull: { likes: id } }, {new: true})
        await Post.updateMany({},{ $pull: { comments: { userId: id } } }, {new: true})
        await Chat.deleteMany({members: { $in: [id] }})
        res.status(200).json(id)
    } catch (err) {
        res.status(500).json(err);
    }
}

const editUser = async (req,res) => {
    const { id } = req.params;
    const { email, username, name, info } = req.body;
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate && (duplicate._id.toString() !== id)) return res.sendStatus(409);
    const updateUser = {
        email: email,
        username: username,
        name: name,
        info: info,
    }
    try {
        const user = await User.findByIdAndUpdate(id, updateUser, {new: true})
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
    }
}

const banUser = async (req,res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id)
        const banned = await User.findByIdAndUpdate(id, {banned: !user.banned}, {new: true})
        res.status(200).json(banned)
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getStatistics,
    getAllUsers,
    getPerMonth,
    deleteUser,
    editUser,
    banUser,
}