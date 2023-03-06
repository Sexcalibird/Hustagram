const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        members: {
            type: [String],
            default: []
        },
        messages: {
            type: [Object],
            default: []
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);