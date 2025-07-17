import { config } from "dotenv";
import express, { json } from "express";
import cors from "cors";
import transcribeRoute from "./routes/transcribeRoute.js";
import chatRoute from "./routes/chatRoute.js"; 

config();
const app = express();

app.use(cors());
app.use(json());

app.use("/api/voice", transcribeRoute); 
app.use("/api/chat", chatRoute);       
console.log("🔐 ENV TEST KEY:", process.env.ASSEMBLY_API_KEY);

export default app;
