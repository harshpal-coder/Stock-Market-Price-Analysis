import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import TrendingStocks from "../components/TrendingStocks";
import StockSearch from "../components/StockSearch";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

const Home = () => {
  const [base64Image, setBase64Image] = useState(null); // 🧠 Lift image from child

  return (
    <div className="main-container">
      <Navbar />

      <main className="page-wrapper">
        <main className="page-container">

          {/* Upload + Trending */}
          <div className="upload-layout">
            <ImageUpload onImageUpload={setBase64Image} /> {/* 🔗 Pass setter */}
            <TrendingStocks />
          </div>

          {/* Stock Search */}
          <StockSearch base64Image={base64Image} /> {/* ✅ Pass image to Search */}

          {/* About Section */}
          <section className="about-section">
            <h2 className="section-title">📘 ABOUT InvestAI</h2>
            <p className="about-text">
            InvestAI is your intelligent stock companion designed to help you make sense of the markets. Whether you're a new investor or a seasoned trader, our platform simplifies complex financial data and stock insights into easy-to-understand summaries.

            Our platform brings together real-time data, smart forecasting, and structured information — all in one clean dashboard. Upload a chart, search a stock, and let InvestAI turn your curiosity into clarity.
            </p>
          </section>

          {/* Insights Flash Cards */}
          <section className="flash-insights">
            <h2 className="section-title">INSIGHTS</h2>
            <div className="flash-card-container">
              <div className="flash-card">
                <h3 className="flash-title">📊 Accurate Financial Overviews</h3>
                <p className="flash-text">
                Quickly understand revenue, net income, market cap, and valuation without digging through complex reports.
                </p>
              </div>

              <div className="flash-card">
                <h3 className="flash-title">🔮 Short-term Price Predictions</h3>
                <p className="flash-text">
                Get forward-looking insights on expected price movements over the next few trading days.
                </p>
              </div>

              <div className="flash-card">
                <h3 className="flash-title">🏢 Detailed Company Background</h3>
                <p className="flash-text">
                Learn what the company does, its industry impact, performance outlook, and if it's worth investing in.
                </p>
              </div>
            </div>
          </section>
        </main>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
