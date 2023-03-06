const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            User: {
                type: Number,
                default: 1999
            },
            Admin: Number
        },
        avatar: {
            type: String,
        },
        followers: {
            type: [String],
            default: [],
        },
        followings: {
            type: [String],
            default: ["63e30c9da2ed6edfaea4bb43"],
        },
        name: {
            type: String,
        },
        info: {
            type: String,
        },
        saved: {
            type:[String],
            default: []
        },
        searchHistory: {
            type:[Object],
            default: []
        },
        banned: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);