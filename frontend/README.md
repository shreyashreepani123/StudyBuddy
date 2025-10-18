# 🧩 StudyBuddy — AI-Powered Study Assistant

🚀 **StudyBuddy** is an AI-powered web app that helps students **generate summaries**, **create flashcards**, **auto-generate quizzes**, and even **chat** with their notes.  
Built with **React (Vite)** for the frontend and **Express.js (Node)** for the backend — powered by **OpenAI GPT-4o-mini** for intelligence.

---

## 🌟 Features

✨ **AI-Powered Summarization** – Automatically summarize large notes or PDFs into concise key points.  
🧠 **Quiz Generator** – Generate smart quiz questions and answers from your notes.  
💡 **Flashcards** – Instantly convert topics into question–answer flashcards for revision.  
📄 **PDF Upload Support** – Upload and extract text directly from PDFs.  
💬 **Ask AI** – Ask questions directly from your notes (context-aware responses).  
🎨 **Beautiful UI** – Dark-mode enabled starry theme with interactive animations.  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + Axios |
| **Backend** | Node.js + Express |
| **AI Engine** | OpenAI GPT-4o-mini |
| **File Parsing** | pdf-parse-fixed |
| **Styling** | TailwindCSS + Custom CSS |
| **Version Control** | Git + GitHub |

---

## 📁 Project Structure

```bash
study_buddy/
├── frontend/                      # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/            # Navbar, Flashcard, Quiz, etc.
│   │   ├── pages/                 # Learn, Quiz, Summary, Upload, etc.
│   │   ├── assets/                # Icons, images, etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # Node.js + Express backend
│   ├── server.js                  # Main server file
│   ├── package.json
│   ├── .env                       # (Contains your OpenAI API key)
│   └── uploads/                   # Temporary PDF uploads
│
├── .gitignore
├── README.md
└── package-lock.json
