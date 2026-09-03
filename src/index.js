/*
   ================================================================
   SCHOLAR NEXUS // COMPLETE SERVER BACKEND
   ================================================================
   Features:
   1. Academic Search & Analysis (Semantic Scholar + Gemini AI) ..... Done and need to be checked
   2. Topic Explorer (AI Keyword Mapping) ..... Done and need to be checked
   4. Jobs Portal (Interactive Map, Filtering, Application System) ..... Done and need to be checked
   5. Academic Search & Analysis (Data Base) ..... Done and need to be checked
   7. Graduation Projects (Form and dashboard )  ..... in progres
   ================================================================
    author: Mohamed Gad Mohaned
    ...
   ================================================================
   notes: اي كومنت بالعربي يبقي ده مهم جدا
*/

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(process.cwd());
import cookieParser from "cookie-parser";
import fs from "node:fs";
import os from "node:os";
import xlsx from "xlsx";
import * as cheerio from "cheerio";
import logger from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error.js";
import feedbackRouter from "./modules/feedback/feedback.routes.js";
import researchersRouter from "./modules/researchers/researchers.routes.js";
import teamRouter from "./modules/team/team.routes.js";
import publicationsRouter from "./modules/publication/publication.routes.js";
import { extractTopField, extractData } from "./utils/extractors.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/authentication/auth.js";

// --- APP CONFIGURATION ---
const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Authentication Routes (SHOULD BE ABOVE THE JSON PARSING)
app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.json());
app.use(cors());

app.use(logger); // Custom logging middleware to log all requests with timestamps and details
app.use(cookieParser());
// app.use(errorHandler);

app.use("/api", researchersRouter);
app.use("/api/publication", publicationsRouter);
app.use("/api/team", teamRouter);
app.use("/api/feedback", feedbackRouter);

// ================================================================
//  SECTION: ACADEMIC SCANNER API (Researcher Analysis)
// ================================================================

/**
 * API: Search Researchers
 * Wraps Semantic Scholar API
 */
app.get("/api/search", async (req, res) => {
  const { query, description, page, limit } = req.query;
  if (!query && !description)
    return res.status(400).json({ error: "Query or Description required" });
  try {
    const response = await axios.get(
      `https://api.semanticscholar.org/graph/v1/author/search`,
      {
        params: {
          query,
          limit: limit || 15,
          offset: limit * page - limit || 0,
          fields:
            "authorId,name,hIndex,paperCount,citationCount,papers.fieldsOfStudy",
        },
        headers: { "x-api-key": process.env.S2_API_KEY || "" },
      },
    );

    const processed = (response.data.data || []).map((author) => ({
      ...author,
      primaryField: extractTopField(author.papers),
    }));

    res.json({
      success: true,
      total: response.data.total || response.data.data?.length || 0,
      authors: processed || [],
    });
  } catch (e) {
    console.error("S2 Search Error:", e.message);
    res.status(500).json({
      success: false,
      error: "Search Service Unavailable",
    });
  }
});

/**
 * API: Deep Analyze Researcher
 * Fetches papers from S2 and formats the profile (Gemini AI Removed).
 */
app.post("/api/analyze", async (req, res) => {
  const { authorId } = req.body;
  if (!authorId) return res.status(400).send("Target ID Required");

  try {
    // Fetch Author Data from S2
    const resData = await axios.get(
      `https://api.semanticscholar.org/graph/v1/author/${authorId}`,
      {
        params: {
          fields:
            "name,citationCount,hIndex,paperCount,url,papers.title,papers.year,papers.venue,papers.citationCount,papers.fieldsOfStudy,papers.authors,papers.url,papers.openAccessPdf",
        },
        headers: { "x-api-key": process.env.S2_API_KEY || "" },
      },
    );

    const author = resData.data;
    author.primaryField = extractTopField(author.papers);

    // Calculate Collaborations
    const collabMap = new Map();
    if (author.papers) {
      author.papers.forEach((p) => {
        if (p.authors) {
          p.authors.forEach((a) => {
            // Don't count the researcher themselves
            if (a.authorId !== authorId && a.name) {
              if (!collabMap.has(a.authorId)) {
                collabMap.set(a.authorId, {
                  id: a.authorId,
                  name: a.name,
                  count: 0,
                });
              }
              collabMap.get(a.authorId).count++;
            }
          });
        }
      });
    }

    const topCollabs = Array.from(collabMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Return top 10

    // Format Data identically to the local database endpoint
    const localData = {
      name: author.name,
      affiliation: "Semantic Scholar Global",
      main_topic: author.primaryField,
      subtopics: author.primaryField,
      scholar_id: authorId,
    };

    res.json({ local: localData, author: author, collaborators: topCollabs });
  } catch (e) {
    console.error("Analysis Error:", e);
    res.status(500).json({ error: "Analysis Failed" });
  }
});

/**
 * API: Explore Idea
 * AI converts idea to keywords -> Parallel Search -> Ranking Algorithm
 */
// ================================================================
//  SECTION: TOPIC EXPLORER API
// ================================================================

app.get("/api/explore", async (req, res) => {
  const { paperId, mode, year } = req.query;

  const FIELDS =
    "paperId,title,abstract,venue,year,authors,citationCount,openAccessPdf,url,externalIds";

  try {
    let apiUrl = "";
    const defaults = { fields: FIELDS, offset: 0, limit: 10, sort: "asc" };
    const params = { ...defaults, ...req.query };

    if (mode === "recommend" && paperId) {
      let targetId = paperId;
      if (/^\d+$/.test(String(paperId))) {
        targetId = `CorpusId:${targetId}`;
      }

      console.log(`[S2] Recommend for ID: ${targetId}`);
      apiUrl = `https://api.semanticscholar.org/graph/v1/paper/${targetId}/recommendations`;
    } else {
      apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search`;
      if (year) params.year = `${year}-`;
    }

    const response = await axios.get(apiUrl, {
      params,
      headers: { "x-api-key": process.env.S2_API_KEY || "" },
    });

    res.json({
      success: true,
      total: response.data.total || response.data.data?.length || 0,
      papers: response.data.data || [],
    });
  } catch (e) {
    console.error(
      `[S2 API Error] Mode: ${mode} | ID: ${paperId} | Msg: ${e.message}`,
    );

    if (e.response?.status === 404) {
      return res.json({
        success: true,
        papers: [],
        total: 0,
        message: "No recommendations found for this specific paper.",
      });
    }

    res.status(500).json({ error: "Search service unavailable." });
  }
});

app.use(errorHandler);
// Vercel invokes the exported app as a serverless handler; do not bind a listener there.
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
