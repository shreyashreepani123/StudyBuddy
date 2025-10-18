import React, { createContext, useState, useContext, useEffect } from "react";

// ✅ Create the Notes Context
export const NotesContext = createContext();

// ✅ Custom Hook for easier access
export const useNotes = () => useContext(NotesContext);

// ✅ Provider Component
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // 🔄 Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("savedNotes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.error("Error parsing saved notes:", err);
      }
    }
  }, []);

  // 💾 Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedNotes", JSON.stringify(notes));
  }, [notes]);

  // 🧩 Add a note (used by UploadPage)
  const addNote = (note) => setNotes((prev) => [...prev, note]);

  // 🗑 Clear all notes (used by UploadPage's clear button)
  const clearNotes = () => {
    setNotes([]);
    localStorage.removeItem("uploadedText");
    localStorage.removeItem("savedNotes");
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, setNotes, clearNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
