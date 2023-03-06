const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config()

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require('./middleware/credentials');

const app = express();
const port = process.env.PORT || 8080

connectDB()

app.use(credentials);
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(express.json({limit: '20mb'}))
app.use(cookieParser())

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/users', require('./routes/users'))
app.use('/posts', require('./routes/posts'))
app.use('/search', require('./routes/search'))
app.use('/chat', require('./routes/chats'))
app.use('/notification', require('./routes/notifications'))
app.use('/admin', require('./routes/admin'))

app.listen(port, () => {
    console.log(`Server start at port ${port}`)
})