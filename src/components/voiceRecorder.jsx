import { useRef, useState } from "react";
import axios from "axios";

export default function VoiceRecorder({ onTranscribe }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "voice.webm");

        try {
          const res = await axios.post("http://localhost:5000/api/voice", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("✅ Transcription success:", res.data.text);
          if (onTranscribe) {
            onTranscribe(res.data.text); // ✅ use the correct prop name
          }
        } catch (err) {
          console.error("❌ Transcription error:", err.message);
          alert("Transcription failed. Try again.");
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("🎙️ Microphone access denied or unavailable");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`px-3 py-2 rounded ${
        recording ? "bg-red-600" : "bg-green-600"
      } text-white hover:opacity-90 transition`}
    >
      {recording ? "⏹ Stop" : "🎤 Speak"}
    </button>
  );
}
