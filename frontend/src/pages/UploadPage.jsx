import React, { useState, useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import "./UploadPage.css";
import logo from "../assets/logo.png"; // ✅ make sure this path is correct

export default function UploadPage() {
  const { notes, addNote, clearNotes } = useNotes();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ✅ On mount, reload notes from localStorage (so chatbot & UI stay synced)
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("savedNotes") || "[]");
    if (savedNotes.length > 0) {
      savedNotes.forEach((n) => addNote(n));
    }
  }, []);

  // ✅ Whenever notes change, update both localStorage and chatbot’s context text
  useEffect(() => {
    if (notes.length > 0) {
      // Save all notes to localStorage
      localStorage.setItem("savedNotes", JSON.stringify(notes));

      // Merge all text content so Chatbot can read it
      const combinedText = notes.map((n) => n.text).join("\n\n");
      localStorage.setItem("uploadedText", combinedText);
    } else {
      localStorage.removeItem("savedNotes");
      localStorage.removeItem("uploadedText");
    }
  }, [notes]);

  // ✅ Handles file upload to backend + saves extracted text
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.text) {
          // ✅ Store extracted text in NotesContext
          addNote({
            name: file.name,
            text: data.text,
          });
        } else {
          throw new Error(data.error || "No text returned");
        }
      }
      alert("✅ Files uploaded and processed successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ Failed to upload or extract PDF text.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      {/* === HERO SECTION === */}
      <section className="hero-section">
        <div className="hero-title-wrapper">
          <img src={logo} alt="StudyBuddy Logo" className="hero-logo" />
          <h1 className="hero-title">
            Welcome to <span>StudyBuddy</span>
          </h1>
        </div>
        <p className="hero-subtitle">
          Your personal AI-powered study assistant that helps you learn smarter,
          not harder 💪
        </p>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="features">
        <div className="feature-card">
          <span className="emoji">🧠</span>
          <h3>Summarize Notes</h3>
          <p>Upload PDFs or text, and StudyBuddy creates crisp summaries.</p>
        </div>
        <div className="feature-card">
          <span className="emoji">📝</span>
          <h3>Auto-Quiz Generator</h3>
          <p>Generate smart quiz questions from your content instantly.</p>
        </div>
        <div className="feature-card">
          <span className="emoji">🤖</span>
          <h3>Ask Your Tutor</h3>
          <p>Chat with AI trained on your notes — your personal mentor!</p>
        </div>
      </section>

      {/* === UPLOAD AREA === */}
      <section className="upload-box">
        <h2>📤 Upload Your Notes</h2>
        <p className="upload-desc">
          Drag & drop your PDFs here or click below to select files.
        </p>

        <div className="upload-area">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            className="upload-input"
          />
          <button className="upload-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload All 🚀"}
          </button>
          {notes.length > 0 && (
            <button className="clear-btn" onClick={clearNotes}>
              Clear All ❌
            </button>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}
      </section>

      {/* === DISPLAY UPLOADED NOTES === */}
      {notes && notes.length > 0 && (
        <div className="uploaded-notes">
          <h3>🗂 Uploaded Notes</h3>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
