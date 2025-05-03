// src/components/Loading.jsx
import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p className="loading-text">Generating AI Stock Insights...</p>
    </div>
  );
};

export default Loading;
