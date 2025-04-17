import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controller/chat.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/send-message", isAuth, sendMessage);
router.get("/get-messages", isAuth, getMessages);
router.get("/conversations/:user_id", isAuth, getConversations);

export default router;
