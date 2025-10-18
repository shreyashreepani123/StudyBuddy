import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import "./ChatPage.css";

export default function ChatPage() {
  const { notes } = useNotes();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (notes.length === 0) {
      alert("Please upload notes first!");
      return;
    }
    if (!question.trim()) {
      alert("Please type a question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const combinedText = notes.map((n) => n.text).join("\n");

      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedText, question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No response received.");
    } catch (err) {
      console.error(err);
      setAnswer("❌ Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Ask Your StudyBuddy 🤖</h2>
      <p className="chat-subtitle">
        Ask questions about your uploaded notes. The AI tutor will respond based only on your content.
      </p>

      <div className="chat-box">
        <textarea
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking..." : "Ask 🧠"}
        </button>
      </div>

      {answer && (
        <div className="chat-answer">
          <h4>Answer:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
