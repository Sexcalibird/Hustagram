const Notification = require('../models/Notification')
const mongoose = require("mongoose");
const User = require("../models/User");

const getNotifications = async (req,res) => {
    const {id} = req.params
    try {
        const ntfc = await Notification.findOne({userId: id}).select('notifications -_id').lean();
        let userId = ntfc.notifications.map(n => n.userId)
        const users = await User.find({ '_id': { $in: userId } }, "_id username avatar").lean()
        const author = users.map(({_id: userId, username, avatar})=>({userId, username, avatar}))
        const result = ntfc.notifications.map(c => ({...c, ...author.find(a => a.userId.toString() === c.userId)}))
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err);
    }
}

const newNotification = async (req,res) => {
    const { id } = req.params;
    const { postId, userId, text } = req.body;
    const obj = {
        _id: new mongoose.Types.ObjectId(),
        postId: postId,
        userId: userId,
        text: text,
        date: new Date(),
    }
    try {
        const ntfc = await Notification.findOne({userId: id});
        ntfc.notifications.push(obj);
        const updatedNtfc = await Notification.findOneAndUpdate({userId: id}, ntfc, { new: true });
        res.status(200).json(updatedNtfc);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getNotifications,
    newNotification,
}