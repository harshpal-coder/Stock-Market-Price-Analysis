import axios from "axios";

export const chatWithStock = async (req, res) => {
  const { stockName, context, message } = req.body;

  if (!stockName || !message) {
    return res.status(400).json({ error: "Missing stock name or user message." });
  }

  try {
    const chatPrompt = `
    You are an expert stock market advisor. Use the following context to answer questions about "${stockName}" in a clear and **brief** manner.
    
    📌 Guidelines:
    - Keep your answers short (max 2–3 sentences).
    - Avoid repeating the question.
    - Do not include disclaimers or generic investment warnings.
    - Only include helpful insights based on context.
    
    Context:
    ${context}
    
    User Question:
    ${message}
    
    Answer briefly:
    `;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: chatPrompt }]
          }
        ]
      }
    );

    const rawReply = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawReply || rawReply.trim() === "") {
      return res.status(400).json({ error: "❌ Gemini returned an empty response." });
    }

    return res.status(200).json({ reply: rawReply.trim() });

  } catch (err) {
    console.error("❌ Gemini Chat Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Chatbot failed to generate a response." });
  }
};
