const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("Database start connection: ...")
    await mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 3000
    })
        .then(() => {
            console.log("Database connection successfully!");
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = connectDB