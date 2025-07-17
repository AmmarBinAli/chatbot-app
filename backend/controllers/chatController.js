import Message from "../models/Massege.js";

export const saveMessage = async (req, res) => {
  try {
    const { userId, role, text } = req.body;
    const msg = await Message.create({ userId, role, text });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const messages = await Message.find({ userId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
