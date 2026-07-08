import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

//const app = express();

dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL ||"http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log("server is running on port : " + PORT);
    connectDB();
});