import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/auth", authRoutes);

app.listen(5001, ()=>{
    console.log("server is running on port : " + PORT);
    connectDB();
});