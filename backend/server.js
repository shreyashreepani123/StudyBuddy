import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse-fixed";
import OpenAI from "openai";

dotenv.config(); // ✅ Load .env file

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware setup
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ File upload configuration
const upload = multer({ dest: "uploads/" });

// ✅ Initialize OpenAI client using your .env key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Basic route to test
app.get("/", (req, res) => res.send("✅ StudyBuddy backend is running!"));

// --------------------------------------------------------
// 📄 Upload & Extract Text from PDF
// --------------------------------------------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    fs.unlinkSync(req.file.path); // cleanup temporary file

    res.json({ text: pdfData.text || "" });
  } catch (err) {
    console.error("❌ PDF Upload Error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// --------------------------------------------------------
// 🧠 Summarize Notes
// --------------------------------------------------------
app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const prompt = `
    Summarize the following study notes into a concise, structured summary.
    Use bullet points and keep it clear and easy to read.

    Notes:
    ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const summary = response.choices?.[0]?.message?.content || "No summary returned.";
    res.json({ summary });
  } catch (err) {
    console.error("❌ Summary Error:", err);
    res.status(500).json({ error: "Error summarizing notes" });
  }
});

// --------------------------------------------------------
// 📝 Auto Quiz Generator
// --------------------------------------------------------
app.post("/api/quiz", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const prompt = `
    Generate 6 short quiz questions with clear answers from the following notes.
    Format as:
    Q1: <question>
    A1: <answer>

    Notes:
    ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
    });

    const quiz = response.choices?.[0]?.message?.content || "No quiz generated.";
    res.json({ quiz });
  } catch (err) {
    console.error("❌ Quiz Error:", err);
    res.status(500).json({ error: "Error generating quiz" });
  }
});

// --------------------------------------------------------
// 💡 Flashcards Generator
// --------------------------------------------------------
app.post("/api/flashcards", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const prompt = `
    Convert the following notes into 8 short flashcards.
    Each flashcard should have:
    Front: a question or keyword
    Back: a simple, short answer (under 30 words)

    Notes:
    ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const flashcards = response.choices?.[0]?.message?.content || "No flashcards generated.";
    res.json({ flashcards });
  } catch (err) {
    console.error("❌ Flashcards Error:", err);
    res.status(500).json({ error: "Error generating flashcards" });
  }
});

// --------------------------------------------------------
// 🤖 Chatbot / Ask a Question
// --------------------------------------------------------
app.post("/api/ask", async (req, res) => {
  try {
    const { text, question } = req.body;
    if (!text || !question)
      return res.status(400).json({ error: "Missing text or question" });

    const prompt = `
    You are a smart study assistant. Use ONLY the notes below to answer the user's question.
    If the information is not in the notes, reply with "I don't know from these notes."

    Notes:
    ${text}

    Question: ${question}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const answer = response.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ answer });
  } catch (err) {
    console.error("❌ Ask Route Error:", err);
    res.status(500).json({ error: "Error answering question" });
  }
});

// --------------------------------------------------------
// 🚀 Start the Server
// --------------------------------------------------------
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
