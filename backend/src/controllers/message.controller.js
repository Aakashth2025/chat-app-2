import messageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    //contact list
    try {
        const loggedInUserId = req.user._id;
        const otherUsers = await UserModel.find({
            _id: { $ne: loggedInUserId }
        }).select("-password"); //all the users except for the current logged in user(yurself)
        res.status(200).json(otherUsers);
    }
    catch (error) {
        console.log("Error in getUserForSidebar:", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;  //rename id to userToChatId
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiver: userToChatId },
                { senderId: userToChatId, receiver: myId }]
        })
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const myId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({
                error: "Message cannot be empty"
            });
        }

        let imgUrl = null;
        if (image) {
            const upload_res = await cloudinary.uploader.upload(image);
            imgUrl = upload_res.secure_url;
        }

        const newMessage = new messageModel({
            senderId: myId,
            receiverId,
            text,
            image: imgUrl
        });

        await newMessage.save();

        //todo: realtime using socket.io

        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};