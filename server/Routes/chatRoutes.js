import express from "express";
const router = express.Router();

import { 
  getConversations, 
  getMessagesBetweenUsers, 
  markAsRead 
} from "../Controllers/chatController.js";
import { protect } from "../Middlewares/auth.js";

// Chat-specific routes
router.get("/conversations", protect, getConversations);
router.get("/messages/:partnerId", protect, getMessagesBetweenUsers);
router.patch("/messages/read/:partnerId", protect, markAsRead);

export default router;