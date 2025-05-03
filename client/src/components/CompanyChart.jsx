import React from "react";
import "./CompanyChart.css";

const CompanyChart = ({ symbol }) => {
  if (!symbol) return null;

  const getFullSymbol = (symbol) => {
    const name = symbol.toUpperCase();

    const NSE = [
      "TATAMOTORS", "RELIANCE", "INFY", "HDFCBANK", "SBIN", "ITC",
      "ICICIBANK", "WIPRO", "LT", "BHARTIARTL", "AXISBANK", "KOTAKBANK"
    ];
    const NASDAQ = ["TSLA", "AAPL", "GOOGL", "MSFT", "NVDA", "META", "AMZN"];
    const NYSE = ["GE", "IBM", "WMT", "XOM", "JNJ", "BAC"];

    if (NSE.includes(name)) return `NSE:${name}`;
    if (NASDAQ.includes(name)) return `NASDAQ:${name}`;
    if (NYSE.includes(name)) return `NYSE:${name}`;

    return name; // fallback — may fail
  };

  const chartSymbol = getFullSymbol(symbol);

  return (
    <div className="chart-container">
      <h3 className="section-heading">📈 {symbol} Live Chart</h3>
      <iframe
        src={`https://s.tradingview.com/widgetembed/?symbol=${chartSymbol}&interval=D&hideideas=1&theme=dark`}
        width="100%"
        height="400"
        frameBorder="0"
        allowTransparency="true"
        scrolling="no"
        title={`${symbol} Live Chart`}
      ></iframe>
    </div>
  );
};

export default CompanyChart;
