import yahooFinance from 'yahoo-finance2';

export const fetchYahooSnapshot = async (stockName) => {
  try {
    const quote = await yahooFinance.quote(stockName);
    return {
      currentPrice: quote.regularMarketPrice,
      currency: quote.currency,
      name: quote.shortName || stockName,
    };
  } catch (error) {
    console.error("⚠️ Yahoo Finance fetch error:", error.message);
    return null;
  }
};
