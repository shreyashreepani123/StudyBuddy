import React, { useState } from "react";
import "./ChatBotWidget.css";
import { MessageCircle, X } from "lucide-react";

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your StudyBuddy AI Tutor! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Send question + uploaded notes to backend AI
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Get uploaded text (context) from localStorage
      const uploadedText = localStorage.getItem("uploadedText") || "";

      if (!uploadedText) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "⚠️ I don’t see any uploaded notes yet. Please upload a PDF first so I can answer your questions!",
          },
        ]);
        setLoading(false);
        return;
      }

      // ✅ Send question + notes context to backend
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: uploadedText,
          question: userMsg.text,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botReply =
        data.answer ||
        "🤔 Hmm, I couldn’t find that in your notes. Try rephrasing or uploading your notes again!";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("ChatBot API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "⚠️ Error: Could not connect to StudyBuddy AI. Make sure your backend (port 5000) is running properly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating chatbot button */}
      <button
        className={`chatbot-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ask StudyBuddy"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-popup glass-effect">
          <div className="chatbot-header">
            <h3>💬 StudyBuddy AI</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              ✖
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message bot typing">
                <i>Thinking...</i>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
