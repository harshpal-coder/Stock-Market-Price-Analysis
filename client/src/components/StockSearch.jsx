import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./loading"; // Make sure this path is correct
import "./StockSearch.css";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const StockSearch = () => {
  const [stockName, setStockName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setErrorMessage(""); // Clear previous errors

    if (!stockName.trim()) {
      setErrorMessage("⚠️ Please enter a valid stock name.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/insight`, {
        stockName: stockName.trim(),
      });

      localStorage.setItem("prediction_result", JSON.stringify(response.data));
      navigate("/prediction");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        "❌ Something went wrong. Try a different stock name.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="search-box">
      <h2 className="search-title">🔎 Search Stock</h2>

      <div className="search-input-container">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g. TSLA, AAPL)"
          className="search-input"
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default StockSearch;
