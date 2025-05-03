// server/controllers/trendingController.js
import axios from "axios";

export const fetchTrendingStocks = async (req, res) => {
  try {
    const prompt = `
Give only a valid JSON array of 5 top trending Indian stock tickers (NSE symbols) like:
["RELIANCE", "TATAMOTORS", "HDFCBANK", "ICICIBANK", "INFY"]
No explanation. No formatting. Only pure JSON.`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    );

    const rawText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📦 Gemini response:", rawText); // 👈 IMPORTANT

    let stocks;
    try {
      stocks = JSON.parse(rawText);
    } catch (e) {
      return res.status(400).json({ error: "❌ Gemini returned invalid JSON." });
    }

    if (!Array.isArray(stocks)) {
      return res.status(400).json({ error: "❌ Gemini response was not an array." });
    }

    res.status(200).json({ trending: stocks });
  } catch (err) {
    console.error("❌ Gemini Trending API error:", err.message);
    res.status(500).json({ error: "Failed to fetch trending stocks." });
  }
};
