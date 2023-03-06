const User = require("../models/User")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const getProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username : username}, '-password -roles -saved -timestamps -__v');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const getSuggestion = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id)
        user.followings.push(id)
        const arr = user.followings.map(function(el) { return mongoose.Types.ObjectId(el) })
        const suggestion = await User.aggregate([
            { $match : { _id : { $nin: arr } } },
            { $project : { username : 1 , avatar : 1 } },
            { $sample: { size: 4 } }
        ])
        res.status(200).json(suggestion);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const updateUser = async  (req,res) => {
    const { id } = req.params;
    const { username, name, info } = req.body;
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate && (duplicate._id.toString() !== id)) return res.sendStatus(409);
    const updateUser = {
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

const updateAvatar = async (req,res) => {
    const { id } = req.params;
    const { avatar } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, {avatar: avatar}, {new: true})
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
    }
}

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPwd, newPwd } = req.body;

    const foundUser = await User.findById(id);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(oldPwd, foundUser.password);
    if(!match) return res.status(400).json({ 'message': 'Wrong password.' })

    try {
        const hashedPwd = await bcrypt.hash(newPwd, 10);
        const pwd = await User.findByIdAndUpdate(id, {password: hashedPwd}, {new: true})
        res.status(200).json('Updated')
    } catch (err) {
        return res.status(500).json(err);
    }

}

const followUser = async (req,res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const user = await User.findById(id)
        const profile = await User.findById(userId)
        const index = user.followings.findIndex((id) => id ===String(userId))
        /*const indexP = profile.followers.findIndex((userId) => userId ===String(id))*/
        if (index === -1) {
            user.followings.push(userId);
            profile.followers.push(id)
        } else {
            user.followings = user.followings.filter((id) => id !== String(userId));
            profile.followers = profile.followers.filter((userId) => userId !== String(id))
        }
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true })
        const updatedProfile = await User.findByIdAndUpdate(userId, profile, {new: true})
        res.status(200).json({updatedUser, updatedProfile});
    } catch (err) {
        res.status(500).json(err);
    }
}

const savePost = async (req,res) => {
    const { id } = req.params;
    const { postId } = req.body;
    try {
        const user = await User.findById(id)
        const index = user.saved.findIndex((id) => id ===String(postId))
        if (index === -1) {
            user.saved.push(postId);
        } else {
            user.saved = user.saved.filter((id) => id !== String(postId));
        }
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true })
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getFollowers = async (req,res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({username : id})
        const users = await User.find({ '_id': { $in: user.followers } }, "_id username avatar")
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getFollowings = async (req,res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({username : id})
        const users = await User.find({ '_id': { $in: user.followings } }, "_id username avatar")
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    updateUser,
    updateAvatar,
    updatePassword,
    getProfile,
    followUser,
    savePost,
    getSuggestion,
    getFollowers,
    getFollowings,
}