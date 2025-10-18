import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";

import Navbar from "./components/Navbar";
import Background from "./components/Background";
import ChatBotWidget from "./components/ChatBotWidget";

import UploadPage from "./pages/UploadPage";
import SummaryPage from "./pages/SummaryPage";
import QuizPage from "./pages/QuizPage";
import LearnPage from "./pages/LearnPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isNight);
  }, [isNight]);

  return (
    <NotesProvider>
      {/* 🚫 No BrowserRouter here */}
      <Background isNight={isNight} setIsNight={setIsNight} />
      <Navbar />
      <main
        style={{
          padding: "40px 20px",
          minHeight: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "var(--text-color)",
          transition: "color 0.4s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>

      <ChatBotWidget />
    </NotesProvider>
  );
}
