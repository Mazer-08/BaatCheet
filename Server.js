const express = require ("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require('./config/db')
const UserRoutes = require('./routes/UserRoutes')   
const ChatRoutes = require('./routes/ChatRoutes')
const MessageRoutes = require('./routes/MessageRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req,res)=>{
    res.send("Hello from baatcheet Admin");
})

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/user', UserRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/message', MessageRoutes);
const server = app.listen(PORT, ()=>{console.log(`Server up and about at ${PORT}`)});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User joined room", userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined Room", room);
    });

    socket.on("new message", (newMessage) => {
        console.log("New message")
        let chat = newMessage.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessage.sender._id) return;
            console.log("Emitting to", user._id);
            socket.in(user._id).emit("message recieved", newMessage);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});