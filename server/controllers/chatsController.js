const Chat = require("../models/Chat");
const User = require("../models/User");
const mongoose = require("mongoose");

const addNewChat = async (req,res) => {
    const {userId1, userId2} = req.body
    const newChat = new Chat({
        members: [userId1, userId2]
    });
    const chat = await Chat.findOne({members: { $all: [userId1, userId2] }});
    if (chat) return
    try {
        const savedChat = await newChat.save()
        res.status(200).json(savedChat);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getChatList = async (req,res) => {
    const {id} = req.params
    try {
        const chats = await Chat.find({members: { $in: [id] }}).select('members updatedAt').lean();

        const userId = chats.map(c => c.members.filter((m) => m !== id) ).map(u => u.join())
        const userList = await User.find({ '_id': { $in: userId } }, "_id username avatar").lean()
        const users = userList.map(({_id: userId, username, avatar})=>({userId, username, avatar}))

        const result = chats.map(c => ({...c, ...users.find(u => c.members.indexOf(u.userId.toString()) > -1)}))
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getChat = async (req,res) => {
    const {userId1, userId2} = req.params
    try {
        const chat = await Chat.findOne({members: { $all: [userId1, userId2] }});
        res.status(200).json(chat)
    } catch (err) {
        res.status(500).json(err);
    }
}

const newMessage = async (req,res) => {
    const { id } = req.params;
    const { userId, mess } = req.body;
    const obj = {
        _id: new mongoose.Types.ObjectId(),
        userId: userId,
        mess: mess,
        date: new Date(),
    }
    try {
        const chat = await Chat.findById(id);
        chat.messages.push(obj);
        const updatedChat = await Chat.findByIdAndUpdate(id, chat, { new: true });
        res.status(200).json(obj);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    addNewChat,
    getChatList,
    getChat,
    newMessage,
}