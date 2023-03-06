const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        likes: {
            type: [String],
            default: [],
        },
        comments: {
            type: [Object],
            default: [],
        },
        edited: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);