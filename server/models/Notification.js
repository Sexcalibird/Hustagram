const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        userId : {
            type: String
        },
        notifications: {
            type: [Object],
            default: []
        },
    },
);

module.exports = mongoose.model("Notification", NotificationSchema);