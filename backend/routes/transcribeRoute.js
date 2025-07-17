import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();


const router = express.Router();
const upload = multer({ dest: "uploads/" });

const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const audioPath = req.file.path;

    // Step 1: Upload audio to AssemblyAI
    const uploadRes = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fs.createReadStream(audioPath),
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
          "transfer-encoding": "chunked",
        },
      }
    );

    const audioUrl = uploadRes.data.upload_url;

    // Step 2: Request transcription
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: audioUrl },
      { headers: { authorization: ASSEMBLY_API_KEY } }
    );

    const transcriptId = transcriptRes.data.id;

    // Step 3: Polling
    let completed = false;
    let transcriptText = "";

    while (!completed) {
      const pollingRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLY_API_KEY } }
      );

      if (pollingRes.data.status === "completed") {
        completed = true;
        transcriptText = pollingRes.data.text;
      } else if (pollingRes.data.status === "error") {
        return res.status(500).json({ error: "Transcription failed." });
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    fs.unlinkSync(audioPath); // cleanup
    res.json({ text: transcriptText });
  } catch (err) {
    console.error("AssemblyAI error:", err.message);
    res.status(500).json({ error: "Voice transcription failed" });
  }
});
console.log("🔐 Using API Key:", process.env.ASSEMBLY_API_KEY);
console.log("📤 Uploading to AssemblyAI...");

export default router;
