 🤖 AI Chatbot – Assignment 4 (Internee.pk)

A powerful AI Chatbot built with React.js, Node.js (Express), Clerk Authentication, MongoDB, and AssemblyAI. It features real-time AI responses, voice input, chat history, dark mode, and more.

🚀 Features

✅ User Authentication – Powered by [Clerk](https://clerk.com)  
✅ AI Integration – OpenRouter API using OpenAI's GPT-3.5 model  
✅ Voice Input – AssemblyAI Whisper API for speech-to-text  
✅ Chat History – Stored in MongoDB per user  
✅ Dark Mode Toggle  
✅ Streaming AI Responses (via Express Proxy)  
✅ Responsive UI – TailwindCSS & ChatGPT-like design  

📦 Tech Stack

- Frontend: React.js, Tailwind CSS, Clerk, Vite
- Backend: Node.js, Express.js, MongoDB, AssemblyAI, OpenRouter Proxy
- APIs: OpenRouter (GPT-3.5), AssemblyAI (Whisper)
- Auth: Clerk.dev
- DB: MongoDB (Cloud Atlas)

```🛠️ Installation Guide

1. Clone the Repository

bash
git clone https://github.com/your-username/chatbot-app.git
cd chatbot-app

2. Set Up Environment Files

🔐 backend/.env

PORT=5000
MONGO_URI=your_mongo_connection_string
ASSEMBLY_API_KEY=your_assemblyai_api_key

🔐 frontend/.env

VITE_OPENROUTER_API_KEY=your_openrouter_api_key

📁 Run the Project

🖥️ Backend

cd backend
npm install
node server.js

🌐 Frontend

npm install
npm run dev

🔒 Authentication
This project uses Clerk.dev for user authentication. Replace Clerk keys in your frontend setup as required and ensure you're logged in to access protected features.




