const { Server } = require("socket.io");

const io = new Server(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on("sendMessage", ({ userId, receiverId, mess, date }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                userId,
                mess,
                date,
            });
        }
    });

    socket.on("sendNotification", ({ userId, receiverId, postId, avatar, username, text, date }) => {
        const receiver = getUser(receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getNotification", {
                postId,
                userId,
                avatar,
                username,
                text,
                date,
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

})