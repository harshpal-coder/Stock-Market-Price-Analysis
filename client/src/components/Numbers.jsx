import React from "react";
import "./Numbers.css";

const Numbers = ({ data }) => {
  if (!data || typeof data !== "object") return null;

  return (
    <div className="prediction-box">
      <h3 className="section-heading">📊 Financial Overview</h3>
      <table className="info-table">
        <tbody>
          {Object.entries(data).map(([key, value], i) => (
            <tr key={i}>
              <td className="label">{key}</td>
              <td className="value">{value || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Numbers;
