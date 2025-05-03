import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrendingStocks from "../components/TrendingStocks";
import ChatBot from "../components/Chatbot";
import Numbers from "../components/Numbers";
import PredictedPrice from "../components/PredictedPrice";
import Description from "../components/Description";
import CompanyChart from "../components/CompanyChart";
import "./Prediction.css";

const Prediction = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("prediction_result"));
    setResult(data);
  }, []);

  if (!result) return <div className="prediction-loading">Loading prediction...</div>;

  const stockName = result?.stock || "this stock";
  const description = result?.description || "";
  const financials = result?.financials || {};

  return (
    <>
      <Navbar />
      <div className="prediction-container">
        <h2 className="page-title">🔍 AI Insights for {stockName}</h2>

        {/* 📈 Chart */}
        <CompanyChart symbol={stockName} />

        {/* 🧱 Side-by-side: Financials + Prediction */}
        <div className="two-col-grid">
          <Numbers data={financials} />
          <PredictedPrice data={result.prediction} />
        </div>

        {/* 🏢 Company Description */}
        <Description text={description} />

        {/* 💬 Chatbot */}
        <ChatBot
         stock={result.stock}
          description={result.description}
          financials={result.financials}
        />

        {/* 🔥 Trending Stocks */}
        <TrendingStocks />
      </div>
      <Footer />
    </>
  );
};

export default Prediction;
