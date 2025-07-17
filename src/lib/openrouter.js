export async function fetchChatResponse(messages) {
  if (!Array.isArray(messages)) {
    console.error("❌ Invalid messages:", messages);
    throw new Error("Invalid messages passed to fetchChatResponse");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Chatbot",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo-0613",
      messages,
    }),
  });

  const data = await res.json();
  console.log("🧠 OpenRouter AI Response:", data);

  return data?.choices?.[0]?.message?.content || "❌ No response from AI.";
}
