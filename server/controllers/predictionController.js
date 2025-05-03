import axios from "axios";
import yahooFinance from "yahoo-finance2";

export const generateStockInsight = async (req, res) => {
  const { stockName } = req.body;

  if (!stockName) {
    return res.status(400).json({ error: "Missing stock name." });
  }

  try {
    console.log("🔍 Starting Gemini Insight for:", stockName);

    // 1️⃣ Agent 1: Financial Overview (Gemini)
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

    // 2️⃣ Agent 2: Price Prediction using Yahoo + Simple Trend
    console.log("📉 Fetching Yahoo Finance price...");
    let yahooSymbol = stockName.toUpperCase();
    let quote;
    
    try {
      quote = await yahooFinance.quoteSummary(yahooSymbol, { modules: ["price"] });
    } catch (err) {
      // Retry with ".NS" for Indian stocks
      yahooSymbol = `${stockName.toUpperCase()}.NS`;
      try {
        quote = await yahooFinance.quoteSummary(yahooSymbol, { modules: ["price"] });
      } catch (e) {
        return res.status(400).json({ error: "❌ Could not fetch price for this stock. Check the symbol." });
      }
    }
    
    const currentPrice = quote?.price?.regularMarketPrice;
    const currency = quote?.price?.currency || "USD";
    
    if (!currentPrice) {
      throw new Error("Unable to fetch price from Yahoo.");
    }
    
    // 📆 Future Dates
    const getNextDates = (n) => {
      const dates = [];
      let d = new Date();
      while (dates.length < n) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          dates.push(d.toISOString().split("T")[0]);
        }
      }
      return dates;
    };
    
    const futureDates = getNextDates(3);
    
    // 📊 Simple Prediction (Linear Rise)
    const prediction = futureDates.map((date, i) => ({
      date,
      price: parseFloat((currentPrice + i * 1.25).toFixed(2)),
      currency,
    }));
    
    console.log("✅ Price Prediction:", prediction);
    // 3️⃣ Agent 3: Company Description
    console.log("🧾 Generating Company Summary...");
    const agent3 = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Act as a senior financial analyst and investment advisor. Provide a detailed and structured markdown report about the company **${stockName}**.

Include the following sections:

**🏢 Company Overview**  
Founding year, services, mission, business model, markets.

**🏦 Sector & Industry Position**  
Sector, competitors, market share, edge.

**📈 Financial Highlights**  
Revenue, profit, P/E, market cap, margins.

**💬 Management & Governance**  
CEO profile, leadership, board setup.

**📊 Risk Factors**  
Mention major risks like regulation, inflation, tech, global.

**💡 Investor Insights & Verdict**  
Verdict: ✅ Invest / 🟡 Watchlist / ❌ Avoid

Use bold titles and bullets. Clean markdown only. No emojis.`
              }
            ]
          }
        ]
      }
    );

    const description = agent3.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No description found.";
    console.log("✅ Agent 3 Description Done.");

    // 🎯 Send Final Response
    return res.status(200).json({
      stock: stockName.toUpperCase(),
      financials,
      prediction,
      description,
    });

  } catch (err) {
    console.error("❌ Error generating insight:", err.message || err);
    return res.status(500).json({ error: "Gemini insight generation failed." });
  }
};
