import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import "./SummaryPage.css";

export default function SummaryPage() {
  const { notes } = useNotes();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (notes.length === 0)
      return alert("⚠️ Please upload your notes first!");

    setLoading(true);
    const combinedText = notes.map((n) => n.text).join("\n");

    try {
      const res = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedText }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary generated yet.");
    } catch (err) {
      console.error(err);
      alert("❌ Error generating summary. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-container">
      <div className="summary-card glass-card">
        <h1 className="summary-title">🧠 Generate Smart Summary</h1>
        <p className="summary-subtitle">
          StudyBuddy’s AI condenses your notes into clear, concise key points.
        </p>

        <button
          className={`summary-btn ${loading ? "loading" : ""}`}
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? "✨ Summarizing..." : "Generate Summary"}
        </button>

        {summary && (
          <div className="summary-output fade-in">
            <h3>📋 Summary Result</h3>
            <pre>{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
