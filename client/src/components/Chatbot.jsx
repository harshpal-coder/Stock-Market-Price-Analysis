import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { FaRocketchat, FaPaperPlane, FaTimes } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const ChatBot = ({ stock, financials, description }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: `Hi! Ask me anything about ${stock}` },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockName: stock,
          context: `${description}\n\nFinancials:\n${JSON.stringify(financials)}`,
          message: input,
        }),
      });

      const data = await res.json();
      const botMessage = {
        from: "bot",
        text: data.reply || "🤖 Sorry, I couldn't generate a proper answer.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Error: Unable to get response." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {open ? (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3>💬 Ask AI about {stock}</h3>
            <FaTimes className="chatbot-close" onClick={() => setOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-msg ${msg.from === "user" ? "chat-user" : "chat-bot"}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="chatbot-msg chat-bot">🔄 Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}><FaPaperPlane /></button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setOpen(true)}>
          <FaRocketchat size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
