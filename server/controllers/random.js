import axios from "axios";

export const generateStockInsight = async (req, res) => {
  const { stockName } = req.body;

  if (!stockName) {
    return res.status(400).json({ error: "Missing stock name." });
  }

  try {
    console.log("🔍 Starting Gemini Insight for:", stockName);

    // 1️⃣ Agent 1: Financial Overview (JSON only)
    console.log("🚀 Requesting Agent 1...");
    const agent1 = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Act as a financial analyst. Strictly respond ONLY with valid JSON for the stock symbol "${stockName}". Do NOT include any intro or extra text.

Return in this format only:
{
  "Revenue": "...",
  "NetIncome": "...",
  "MarketCap": "...",
  "PeRatio": "..."
}`
              }
            ]
          }
        ]
      }
    );

    const raw1 = agent1.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = raw1.match(/{[^}]*}/gs);
    let financials;

    try {
      financials = JSON.parse(jsonMatch?.[0] || "");
    } catch (e) {
      return res.status(400).json({ error: "❌ Invalid stock name or financial data not found." });
    }

    console.log("✅ Agent 1 Financials:", financials);

    // 2️⃣ Agent 2: 3-Day Price Prediction (JSON array)
    console.log("🚀 Requesting Agent 2...");
    const agent2 = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a stock forecasting AI. Predict the next 3 trading days of stock price for "${stockName}".

Return ONLY this valid JSON format:

[
  { "date": "2025-04-15", "price": 251.64 },
  { "date": "2025-04-16", "price": 252.98 },
  { "date": "2025-04-17", "price": 254.22 }
]`
              }
            ]
          }
        ]
      }
    );

    const raw2 = agent2.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let prediction;

    try {
      const jsonArrayMatch = raw2.match(/\[\s*{[^]*?}\s*]/);
      prediction = JSON.parse(jsonArrayMatch?.[0] || "");
    } catch (e) {
      console.warn("⚠️ Gemini Agent 2 failed. Using fallback prediction.");
      prediction = [
        { date: "2025-04-15", price: 123.45 },
        { date: "2025-04-16", price: 124.10 },
        { date: "2025-04-17", price: 124.85 }
      ];
    }

    console.log("✅ Agent 2 Prediction:", prediction);

    // 3️⃣ Agent 3: Company Description (well-formatted markdown)
    console.log("🚀 Requesting Agent 3...");
    const agent3 = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Act as a senior financial analyst and investment advisor. Provide a detailed and structured markdown report about the company **${stockName}**.

Include the following sections with strong depth, insights, and examples:

**🏢 Company Overview**  
Explain the company’s background, founding year, founders, mission, business model, key markets, and core offerings.

**🏦 Sector & Industry Position**  
Mention the sector it belongs to, key competitors, current market share, and its competitive advantages or weaknesses.

**📈 Financial Highlights**  
Include available info like:
- Revenue and profit trends over recent years
- P/E ratio, EPS, or market cap
- Debt-equity ratio or margins if applicable
- Major funding, IPO history, or acquisitions

**💬 Management & Governance**  
Who is leading the company? CEO/CTO profile? How is the board structured?

**📊 Risk Factors**  
Discuss risks such as regulation, inflation, tech disruption, or geopolitical issues.

**💡 Investor Insights & Verdict**  
Summarize whether it's a strong long-term investment, short-term trade, or high-risk equity.
Give clear verdict like:
- ✅ Invest
- 🟡 Watchlist
- ❌ Avoid

Respond in clean markdown format with bold section headings and bullet points where relevant. Avoid emojis. Double line space between each section. No summary text or explanation at the end.
`

              }
            ]
          }
        ]
      }
    );

    const description = agent3.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "No description found.";
    console.log("✅ Agent 3 Description generated.");

    // 🎯 Final Output
    return res.status(200).json({
      stock: stockName.toUpperCase(),
      financials,
      prediction,
      description
    });

  } catch (err) {
    console.error("❌ Gemini API Error:");
    if (err.response?.data) {
      console.error("📦 Gemini Response Error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("📛 Raw Error:", err.message || err);
    }

    return res.status(500).json({ error: "Gemini insight generation failed." });
  }
};
