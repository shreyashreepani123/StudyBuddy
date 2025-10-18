import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNotes } from "../context/NotesContext";
import { API_BASE } from "../config";
import "./LearnPage.css";

export default function LearnPage() {
  const { notes } = useNotes();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generateFlashcards = async () => {
    if (notes.length === 0) return alert("⚠️ Please upload notes first!");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/flashcards`, {
        text: notes[0].text,
      });

      const raw = res.data.flashcards;
      const cards =
        typeof raw === "string"
          ? raw.split(/\n{2,}/).map((line, i) => {
              const [q, a] = line.split(" - ");
              return {
                id: i,
                question: q?.trim() || `Flashcard ${i + 1}`,
                answer: a?.trim() || "Answer not provided",
              };
            })
          : [];

      setFlashcards(cards);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error("Flashcard generation failed:", err);
      alert("❌ Error generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = () => setFlipped(!flipped);
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlipped(false);
    }
  };

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1>📚 Learn It (Flashcards)</h1>
        <p>
          Click the card to flip 🔄 <br />
          Use “Next” ➡️ or “Previous” ⬅️ to navigate.
        </p>
        <button
          className={`generate-btn ${loading ? "loading" : ""}`}
          onClick={generateFlashcards}
          disabled={loading}
        >
          {loading ? "✨ Generating..." : "Generate Flashcards"}
        </button>
      </div>

      {flashcards.length > 0 && (
        <div className="flashcard-container">
          <div
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={toggleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <ReactMarkdown className="markdown-text">
                  {flashcards[currentIndex].question}
                </ReactMarkdown>
              </div>
              <div className="flashcard-back">
                <h3 className="answer-title">Answer</h3>
                <ReactMarkdown className="markdown-text">
                  {flashcards[currentIndex].answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ⬅️ Previous
            </button>
            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next ➡️
            </button>
          </div>
        </div>
      )}

      {!loading && flashcards.length === 0 && (
        <p className="empty-text">Generate flashcards to start learning 📖</p>
      )}
      {loading && <p className="empty-text">🧠 Creating smart flashcards...</p>}
    </div>
  );
}
