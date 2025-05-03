import React from "react";
import "./PredictedPrice.css";

const PredictedPrice = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <div className="prediction-box">
      <h3 className="section-heading">🔮 Price Prediction (Next 3 Days)</h3>
      <table className="info-table">
        <thead>
          <tr>
            <th className="label">Date</th>
            <th className="value">Predicted Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isValid = row.price !== undefined && row.price !== null && !isNaN(row.price);
            const currency = row.currency === "INR" ? "₹" : "$";
            return (
              <tr key={i}>
                <td className="label">{row.date || "—"}</td>
                <td className="value">
                  {isValid ? `${currency}${Number(row.price).toFixed(2)}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PredictedPrice;
