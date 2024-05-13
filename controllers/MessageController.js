const UserModel = require("../models/UserModel")
const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/ChatModel");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
  
    try {
        var message = await MessageModel.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
  
        await ChatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
        res.json(message);
    } 
    catch (error) {
        console.log(error)
        res.status(400);
        res.json(error.message);
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({ chat: req.params.chatId })
            .populate("sender", "name username pic email")
            .populate("chat");
        res.json(messages);
    } 
    catch (error) {
        console.log(error)
        res.status(400);
        res.json(error.message);
    }
};

module.exports = { allMessages, sendMessage };
