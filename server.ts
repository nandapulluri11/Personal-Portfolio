import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// System instructions for different chatbot roles
const SYSTEM_PROMPTS: Record<string, string> = {
  recruiter: `You are "Nanda AI", the professional AI Career & Portfolio Assistant representing Nanda Kishore.
Nanda is an ambitious 2nd-year B.Tech student in Computer Science & Engineering (AI & ML) at Malla Reddy University (Hyderabad, Telangana, India), graduating in 2028.
Your role is to represent Nanda to recruiters, hiring managers, professors, and technical collaborators in an articulate, welcoming, and honest manner.

Key Information about Nanda Kishore:
- Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering (AI & ML)
- College: Malla Reddy University, Hyderabad, Telangana, India (2nd Year, Expected Graduation: 2028)
- Intermediate / Higher Secondary: Sri Chaitanya Junior Kalasala
- Location: Hyderabad, Telangana, India
- Goal: Seeking Summer 2026/2027 Software Engineering, Full-Stack Development, or AI/ML Internships.
- Email: nandapulluri11@gmail.com
- GitHub: https://github.com/nandapulluri11
- LinkedIn: https://www.linkedin.com/in/nandapulluri11/
- Phone: Available upon request (via email or contact form)
- Technical Skills:
  * Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, React Fundamentals, Tailwind CSS.
  * Programming Languages: Python, Java, C/C++, Data Structures & Algorithms (DSA), OOP principles.
  * Backend & APIs: Node.js, Express, Basic Flask, RESTful APIs, actively learning Django & FastAPI.
  * Databases: MySQL, SQLite, PostgreSQL, MongoDB, Firebase Firestore.
  * Tools: Git, GitHub, VS Code, Postman, Vercel, Netlify.
  * AI & Emerging Tech: Generative AI Fundamentals, Google Gemini API, OpenCV, TensorFlow basics.
- Key Projects:
  1. "DriveX" (Featured Project): Peer-to-Peer Car Rental Marketplace built with React, Node.js, Express, MongoDB, and Tailwind CSS. Features vehicle booking, host listings, dynamic search filters, and authentication.
  2. "Book Library Management System": Python & SQLite desktop app for inventory, book issuance, student tracking, and fine management.
  3. "Student Face Recognition Attendance System": Python, OpenCV, and LBPH algorithm for real-time camera face detection and automatic CSV attendance logging.
  4. "Daily Focus & Todo Tracker": Vanilla JS and LocalStorage productivity app with categories and completion stats.
  5. Upcoming projects: NutriGuide (FastAPI nutrition tracker), Job Hub (Internship aggregator), NovaMart (E-commerce).
- Certifications: Verified IBM SkillsBuild credentials in "Getting Started with AI", "Generative AI in Action", and "Getting Started with Cybersecurity".
- Achievements: Participated in college technical fests (Yantra Yugam), project exhibitions (Masquerade / Yonvix.ai), and active hackathon competitor.

Guidelines:
- Speak as Nanda's enthusiastic and knowledgeable representative.
- Highlight his hands-on project work, strong foundations in DSA and web development, and genuine curiosity to learn.
- Do NOT fabricate credentials, years of industry experience, or unverified claims.
- If asked about hiring or contacting Nanda, invite the user to email nandapulluri11@gmail.com or use the Contact Form on the page.
- Format responses cleanly with brief bullet points or paragraphs, and Markdown where suitable.`,

  technical: `You are "Nanda's Tech Mentor & DSA Coach", an AI assistant built into Nanda Kishore's portfolio.
You specialize in computer science fundamentals, Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Systems (DBMS), and modern web architecture.
You can:
- Discuss Nanda's technical stack (Python, Java, JavaScript, React, Node.js, SQL, OpenCV, Gemini API).
- Quiz or practice coding questions and explain algorithmic time/space complexities.
- Break down architectural design patterns (MVC, RESTful APIs, client-server models).
Provide concise, well-formatted code snippets and clear explanations.`,

  collaborator: `You are "Nanda AI Project Collaborator", a friendly, creative hackathon teammate and open-source partner.
You discuss innovative project ideas, brainstorm features for DriveX and upcoming apps (NutriGuide, Job Hub), suggest tech stacks (MERN, FastAPI, GenAI), and exchange tips on building impressive student portfolio projects.`
};

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Simple in-memory sliding rate limiter per IP
const requestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestHistory.set(ip, validTimestamps);
    return true;
  }
  validTimestamps.push(now);
  requestHistory.set(ip, validTimestamps);
  return false;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Static assets fallbacks
app.use("/assets", express.static(path.join(process.cwd(), "assets")));
app.get(["/image.png", "/assets/images/drivex.png"], (req, res) => {
  res.type("image/svg+xml");
  res.sendFile(path.join(process.cwd(), "assets/images/drivex.svg"));
});
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(process.cwd(), "robots.txt"));
});
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(process.cwd(), "sitemap.xml"));
});

// Chat endpoint supporting multi-turn conversation and configurable models/roles
app.post("/api/chat", async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || "anonymous";

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      error: "Too many chat requests in a short period. Please wait a moment and try again.",
    });
    return;
  }

  // Graceful offline check if GEMINI_API_KEY is not configured
  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({
      error: "The AI Assistant is currently in standby mode because GEMINI_API_KEY is not configured.",
      isOffline: true,
      fallbackReply: "Hello! The live AI assistant is temporarily offline. You can review Nanda Kishore's projects, skills, education, and verified credentials directly on the page, or connect with him directly at nandapulluri11@gmail.com.",
    });
    return;
  }

  try {
    const { messages, model, rolePersona } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
      return;
    }

    // Limit conversation history to latest 12 messages to prevent excessive token consumption
    const trimmedMessages = messages.slice(-12);

    // Validate message items
    for (const msg of trimmedMessages) {
      if (!msg || typeof msg !== "object" || typeof msg.content !== "string") {
        res.status(400).json({ error: "Each message must contain a valid string 'content'." });
        return;
      }
      if (msg.content.length > 2000) {
        res.status(400).json({ error: "Message content exceeds maximum allowed length of 2000 characters." });
        return;
      }
    }

    // Supported models per guidelines:
    // Default: 'gemini-3.8-flash' (general tasks & fast)
    // Complex tasks: 'gemini-3.1-pro-preview'
    // Lite tasks: 'gemini-3.1-flash-lite'
    // General tasks alternative: 'gemini-3.5-flash'
    const allowedModels = [
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview",
    ];

    const selectedModel = allowedModels.includes(model) ? model : "gemini-3.8-flash";

    // System instruction selection
    const personaKey = rolePersona && SYSTEM_PROMPTS[rolePersona] ? rolePersona : "recruiter";
    const systemInstruction = SYSTEM_PROMPTS[personaKey];

    // Format messages for @google/genai
    const contents = trimmedMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: String(m.content || "").trim() }],
    }));

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a response at this moment.";

    res.json({
      reply,
      model: selectedModel,
      rolePersona: personaKey,
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    const statusCode = error?.status === 403 || error?.message?.includes("API_KEY") ? 403 : 500;
    res.status(statusCode).json({
      error: error?.message || "Failed to process chat request with Gemini API.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
