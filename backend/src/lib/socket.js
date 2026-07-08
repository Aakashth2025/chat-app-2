import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

export function geReceiverSocketId(userId){
    return userMap[userId]
}

const userMap = {}; //online users <userId,socketId>

io.on("connection", (socket)=>{
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userMap));  //send evens(online status) to all connected clients
    socket.on("disconnect", ()=>{
        console.log("A user disconnected", socket.id);
        delete userMap[userId];
        io.emit("getOnlineUsers", Object.keys(userMap));  //send events(online status) to all connected clients
        //after an user disconnected
    });
});
export {io, app, server};