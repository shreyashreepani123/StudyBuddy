import React, { useState } from "react";
import axios from "axios";
import { useNotes } from "../context/NotesContext";
import { API_BASE } from "../config";
import "./QuizPage.css";

export default function QuizPage() {
  const { notes } = useNotes();
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (notes.length === 0) return alert("Upload notes first!");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/quiz`, { text: notes[0].text });
      setQuiz(res.data.quiz);
    } catch {
      alert("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h1 className="quiz-title">🧠 AI Quiz Generator</h1>
        <p className="quiz-subtitle">
          Instantly generate smart, relevant quiz questions based on your uploaded notes.
        </p>

        <button
          className={`quiz-btn ${loading ? "loading" : ""}`}
          onClick={generateQuiz}
          disabled={loading}
        >
          {loading ? "Generating Quiz..." : "Generate Quiz 🚀"}
        </button>

        {loading && <p className="quiz-loading">⏳ AI is preparing your quiz...</p>}

        {quiz && (
          <div className="quiz-output fade-in">
            <h3>📋 Generated Quiz</h3>
            <pre>{quiz}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
