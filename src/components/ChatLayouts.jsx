import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MassegeBubble";
import VoiceRecorder from "./voiceRecorder";
import useDarkMode from "../hooks/useDarkMode";
import { UserButton, useUser } from "@clerk/clerk-react";


export default function ChatLayout() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replying, setReplying] = useState(false);
  const chatRef = useRef(null);
  const [darkMode, setDarkMode] = useDarkMode();
    const { user } = useUser();

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toOpenRouterMessages = (msgs) =>
    msgs.map((m) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.text,
    }));

  const sendMessage = async (userInput = input) => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", text: userInput.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setReplying(true);

    try {
      const openRouterMessages = toOpenRouterMessages(newMessages);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", //
          "X-Title": "Chatbot Resume App",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo-0613",
          messages: openRouterMessages,
        }),
      });

      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content || "⚠️ No response from AI";

      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);

            await fetch("http://localhost:5000/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: "user", text: userInput }),
      });

      await fetch("http://localhost:5000/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: "ai", text: aiReply }),
      });

    } catch (err) {
      console.error("❌ AI error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ AI failed to respond." },
      ]);
    } finally {
      setReplying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceInput = async (text) => {
    if (text) {
      setInput(text);
      await sendMessage(text);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history?userId=guest");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("❌ Failed to load history", err);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col h-[90vh]">
 <header className="p-4 border-b border-gray-200 dark:border-gray-700 text-xl font-semibold flex justify-between items-center">
          🤖 AI Chatbot
          <div className="flex items-center gap-2">
            <UserButton />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:opacity-80"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-2">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} text={msg.text} />
          ))}
          <div ref={chatRef}></div>
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
            className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <div className="flex justify-between items-center mt-2 gap-4">
            <button
              onClick={() => sendMessage()}
              disabled={replying}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {replying ? "Typing..." : "Send"}
            </button>

            <VoiceRecorder onTranscribe={handleVoiceInput} />
          </div>
        </footer>
      </div>
    </div>
  );
}
