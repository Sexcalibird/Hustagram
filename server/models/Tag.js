const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
    {
       tag: {
           type: String
       },
    },
);

module.exports = mongoose.model("Tag", TagSchema);