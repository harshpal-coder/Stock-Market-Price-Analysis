import React from "react";
import ReactMarkdown from "react-markdown";
import "./Description.css";

const Description = ({ text }) => {
  if (!text) return null;

  return (
    <div className="description-box">
      <h3 className="section-heading">🏢 About the Company</h3>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="description-text" {...props} />,
          strong: ({ node, ...props }) => <strong style={{ color: "#32cd32" }} {...props} />
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Description;
