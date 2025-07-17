import express from "express";
import { saveMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/save", saveMessage);
router.get("/history", getMessages);

export default router;  
