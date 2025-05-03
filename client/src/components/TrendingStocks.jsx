import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TrendingStocks.css";

const TrendingStocks = () => {
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trending");
        const data = await res.json();
        setTrending(data.trending || []);
      } catch (err) {
        console.error("Trending fetch failed", err);
      }
    };

    fetchTrending();
  }, []);

  const handleClick = async (stock) => {
    try {
      const res = await fetch("http://localhost:5000/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockName: stock }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem("prediction_result", JSON.stringify(data));
        navigate("/prediction");
      }
    } catch (err) {
      console.error("Error processing Gemini insight:", err);
      alert("❌ Failed to generate insight from Gemini.");
    }
  };

  return (
    <div className="trending-box">
      <h2 className="trending-title">🔥 Trending Indian Stocks</h2>
      <ul className="trending-list">
        {trending.map((stock, i) => (
          <li key={i} onClick={() => handleClick(stock)}>
            {stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingStocks;
