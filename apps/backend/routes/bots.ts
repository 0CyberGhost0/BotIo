import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { prismaClient } from "../../../packages/db";
import multer from "multer";
import path from "path";
import fs from 'node:fs/promises';
import { GoogleGenAI } from "@google/genai";

import {
  extractTextFromPDF,
  extractTextFromTxt,
  extractTextFromRawText,
  extractTextFromDocx,
  extractTextFromURL,
  extractTextFromYouTube,
  extractTextFromNotionPage,
} from "../utils/extractText";
import {getSystemPrompt} from "../utils/getSystemPrompt";
import usage = require("../utils/usage");
import {incrementUsage} from  "../utils/usage";

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure uploads/ directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".txt", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, TXT, and DOCX are allowed."));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.get("/", authMiddleware, async (req, res) => {
  console.log("HIT ALL BOT");
  const bots = await prismaClient.bot.findMany({
    where:{
      ownerId: req.userId
    }
  });
  res.json(bots);
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const botId = Math.random().toString(36).substring(2, 20);
    const { name, description, model } = req.body;
    const bot = await prismaClient.bot.create({
      data: { id: botId, name, description, model, ownerId: req.userId },
      select: {
        id: true,
        name: true,
        description: true,
        model: true,
        ownerId: true,
      },
    });
    await incrementUsage(req.userId, "botCount", 1);
    res.json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/usage",authMiddleware, async (req, res) => {
  console.log("HIT USAGE");
  const usage = await prismaClient.userUsage.findUnique({
    where: { userId: req.userId },
  });
  console.log(usage);
  res.json(usage);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const bot = await prismaClient.bot.findUnique({
    where: { id },
    include: { sources: true }, // Include sources in response
  });
  if (!bot) {
    return res.status(404).json({ error: "Bot not found" });
  }
  res.json(bot);
});

router.get("/:id/sources", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const sources = await prismaClient.source.findMany({
    where: { botId: id },
  });
  res.json(sources);
});

router.post("/train/:id", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content,title } = req.body;
    const file = req.file;

    // Validate input
    if (!type || (!file && !content) || !title) {
      return res.status(400).json({ error: "Type, title, and either file or content are required" });
    }
    let finalTitle = title;

if (!finalTitle) {
  if (file?.originalname) {
    finalTitle = file.originalname.replace(/\.[^/.]+$/, ""); // strip extension
  } else if (type === "url" || type === "notion" || type === "youtube") {
    try {
      const url = new URL(content);
      finalTitle = url.hostname + url.pathname.split("/").pop()?.replace(/[-_]/g, " ") || "Untitled";
    } catch {
      finalTitle = "Untitled";
    }
  } else if (type === "text") {
    finalTitle = content?.substring(0, 30) + (content.length > 30 ? "..." : "");
  }
}

    // Verify bot exists
    const bot = await prismaClient.bot.findUnique({ where: { id } });
    if (!bot) {
      return res.status(404).json({ error: "Bot not found" });
    }

    let extractedContent = "";

    // Extract text based on type
    switch (type) {
      case "pdf":
        if (!file) throw new Error("File required for PDF");
        extractedContent = await extractTextFromPDF(file.path);
        break;
      case "txt":
        if (!file) throw new Error("File required for TXT");
        extractedContent = await extractTextFromTxt(file.path);
        break;
      case "docs":
        if (!file) throw new Error("File required for DOCX");
        extractedContent = await extractTextFromDocx(file.path);
        break;
      case "url":
        if (!content) throw new Error("Content required for URL");
        extractedContent = await extractTextFromURL(content);
        break;
      case "text":
        if (!content) throw new Error("Content required for text");
        extractedContent = await extractTextFromRawText(content);
        break;
      case "youtube":
        if (!content) throw new Error("Content required for YouTube");
        console.log("CONTENT");
        console.log(content);
        extractedContent = await extractTextFromYouTube(content);
        break;
      case "notion":
        if (!content) throw new Error("Content required for Notion");
        const notionPageId = content.split("-").pop(); // Extract page ID from Notion URL
        console.log(notionPageId);
        extractedContent = await extractTextFromNotionPage(notionPageId);
        break;
      default:
        throw new Error("Invalid source type");
    }
    

    // Create new source
    const source = await prismaClient.source.create({
      data: {
        type,
        title: finalTitle,
        content: extractedContent,
        botId: id,
      },
    });

    // Clean up uploaded file
    if (file) {
      await fs.unlink(file.path);
    }
    await incrementUsage(req.userId, "sourcesCount", 1);


    res.json(source);
  } catch (error) {
    console.error("Error training bot:", error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(400).json({ error: error.message || "Failed to train bot" });
  }
});

router.get("/sources", authMiddleware, async (req, res) => {
  const sources = await prismaClient.source.findMany();
  res.json(sources);
});

router.get("/chat", authMiddleware, async (req, res) => {
  console.log("HIT");
  try {
    // Get all chats for the authenticated user
    const chats = await prismaClient.chat.findMany({
      where: { userId: req.userId },
      include: {
        bot: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

router.get("/chat/:id", authMiddleware, async (req, res) => {
  try {
  console.log("HIT");

    const { id } = req.params;
    const chat = await prismaClient.chat.findUnique({
      where: { id },
      include: {
        bot: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    // Verify user owns this chat
    if (chat.userId !== req.userId) {
      return res.status(403).json({ error: "Not authorized to access this chat" });
    }
    
    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.post("/chat/create", authMiddleware, async (req, res) => {
  try {
  console.log(" chat create HIT");

    const { botId } = req.body;

    console.log("BOTTID",botId);
    
    if (!botId) {
      return res.status(400).json({ error: "Bot ID is required" });
    }
    
    // Verify bot exists
    const bot = await prismaClient.bot.findUnique({ where: { id: botId } });
    if (!bot) {
      console.log("BOT NOT FOUND");
      return res.status(404).json({ error: "Bot not found" });
    }
    // Create new chat
    const chat = await prismaClient.chat.create({
      data: {
        botId,
        userId: req.userId,
      },
      include: { bot: true }
    });
    
    res.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

router.post("/chat/:id/message", authMiddleware, async (req, res) => {
  try {
  console.log("HIT");

    const { id } = req.params;
    const { content,botId } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }
    
    // Verify chat exists and belongs to user
    const chat = await prismaClient.chat.findUnique({
      where: { id },
      include: { bot: true }
    });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    if (chat.userId !== req.userId) {
      return res.status(403).json({ error: "Not authorized to access this chat" });
    }
    
    // Create user message
    const userMessage = await prismaClient.chatMessage.create({
      data: {
        chatId: id,
        role: 'user',
        content
      }
    });

    const systemPrompt = await getSystemPrompt(botId);

const contents = [
  {
    role: "model",
    parts: [{ text: systemPrompt }],
  },
  {
    role: "user",
    parts: [{ text: content }], // replace `userInput` with actual query
  },
];

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: contents,
});

console.log(response.text);
    // This is a placeholder - in a real app you'd call your AI service
    const botResponse = await prismaClient.chatMessage.create({
      data: {
        chatId: id,
        role: 'assistant',
        content: response.text
      }
    });
    
    // Update chat's updatedAt timestamp
    await prismaClient.chat.update({
      where: { id },
      data: { updatedAt: new Date() }
    });
    await incrementUsage(req.userId, "responsesUsed", 1);
    
    res.json({
      userMessage,
      botResponse
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
router.get("/embed/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the bot without authentication for public access
    const bot = await prismaClient.bot.findUnique({
      where: { id }
    });
    
    if (!bot) {
      return res.status(404).json({ error: "Bot not found" });
    }
    
    res.json(bot);
  } catch (error) {
    console.error("Error fetching embedded bot:", error);
    res.status(500).json({ error: "Failed to fetch bot" });
  }
});
router.post("/embed/chat", async (req, res) => {
  try {
    const { botId } = req.body;
    
    if (!botId) {
      return res.status(400).json({ error: "Bot ID is required" });
    }
    
    // Verify bot exists
    const bot = await prismaClient.bot.findUnique({ where: { id: botId } });
    if (!bot) {
      return res.status(404).json({ error: "Bot not found" });
    }
    
    // Create new anonymous chat
    // Note: We use a special anonymous user ID or null for embedded chats
    const chat = await prismaClient.chat.create({
      data: {
        botId,
        userId: null,
        isEmbedded: true,
      },
      include: { bot: true }
    });
    
    res.json(chat);
  } catch (error) {
    console.error("Error creating embedded chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

// Handle messages from embedded chat
router.post("/embed/chat/:id/message", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, botId } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }
    
    // Verify chat exists and is an embedded chat
    const chat = await prismaClient.chat.findUnique({
      where: { id, isEmbedded: true },
      include: { bot: true }
    });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    // Create user message
    const userMessage = await prismaClient.chatMessage.create({
      data: {
        chatId: id,
        role: 'user',
        content
      }
    });

    const systemPrompt = await getSystemPrompt(botId);

    const contents = [
      {
        role: "model",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "user",
        parts: [{ text: content }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });

    // Create bot response
    const botResponse = await prismaClient.chatMessage.create({
      data: {
        chatId: id,
        role: 'assistant',
        content: response.text
      }
    });
    
    // Update chat's updatedAt timestamp
    await prismaClient.chat.update({
      where: { id },
      data: { updatedAt: new Date() }
    });
    
    res.json({
      userMessage,
      botResponse
    });
  } catch (error) {
    console.error("Error sending message in embedded chat:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});


export default router;