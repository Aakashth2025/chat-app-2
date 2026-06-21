import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessages } from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);

router.get("/:id", protectRoute, getMessages);  // :id =>jisse tum baat kr rha

router.post("/send/:id", protectRoute, sendMessages);   // :id => jisse tum baat kr rha hai

export default router;