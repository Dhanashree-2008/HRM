// ============================================
// src/services/cv.service.js
// ============================================

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdf = require("pdf-parse");
import mammoth from "mammoth";
import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

/* =========================================================
   Helpers
========================================================= */

const generateId = () => crypto.randomUUID();

/* =========================================================
   Extractors
========================================================= */

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text || "";
  } catch (err) {
    throw new Error("PDF text extraction failed");
  }
};

const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    throw new Error("DOCX text extraction failed");
  }
};

/* =========================================================
   CV Parsing
========================================================= */

const parseCV = (text) => {
  const data = {
    name: null,
    email: null,
    phone: null,
    skills: [],
    education: [],
    currentRole: null,
    currentCompany: null,
    yearsOfExperience: 0,
  };

  // Email
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (email) data.email = email[0];

  // Phone
  const phone = text.match(/(?:\+91[-\s]?)?\d{10}/);
  if (phone) data.phone = phone[0];

  // Name (best-effort)
  const name =
    text.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/m) ||
    text.match(/Name:\s*(.+)/i);
  if (name) data.name = name[1].trim();

  // Skills
  const SKILLS = [
    "JavaScript", "React", "Node.js", "HTML", "CSS", "TypeScript",
    "MongoDB", "MySQL", "PostgreSQL", "Git", "Docker",
    "AWS", "Redux", "Express", "Python", "Java"
  ];

  SKILLS.forEach((skill) => {
    if (new RegExp(`\\b${skill}\\b`, "i").test(text)) {
      data.skills.push(skill);
    }
  });

  // Experience
  const exp = text.match(/(\d+)\+?\s*years?\s*experience/i);
  if (exp) data.yearsOfExperience = parseInt(exp[1]);

  // Current role & company
  const roleCompany = text.match(
    /([A-Z][a-zA-Z\s]+)\s+(?:at|@)\s+([A-Z][a-zA-Z\s]+)/i
  );
  if (roleCompany) {
    data.currentRole = roleCompany[1].trim();
    data.currentCompany = roleCompany[2].trim();
  }

  // Education
  const eduRegex =
    /(B\.?Tech|M\.?Tech|BCA|MCA|B\.?Sc|M\.?Sc|MBA)[^\n]*/gi;
  let edu;
  while ((edu = eduRegex.exec(text)) !== null) {
    data.education.push(edu[0].trim());
  }

  return data;
};

/* =========================================================
   Scoring & AI-ish Logic
========================================================= */

const calculateMatchScore = (cvData, jobPosition) => {
  let score = 0;

  // Experience (30)
  if (cvData.yearsOfExperience >= 5) score += 30;
  else if (cvData.yearsOfExperience >= 3) score += 20;
  else if (cvData.yearsOfExperience >= 1) score += 10;

  // Skills (40)
  score += Math.min(40, cvData.skills.length * 6);

  // Education (20)
  if (cvData.education.length) score += 20;

  // Contact completeness (10)
  if (cvData.email) score += 5;
  if (cvData.phone) score += 5;

  return Math.min(100, score);
};

const generateSummary = (cvData, jobPosition) => {
  return `${cvData.yearsOfExperience || 0}+ years experienced ${jobPosition || "professional"
    } with hands-on expertise in ${cvData.skills.slice(0, 4).join(", ")}. ${cvData.currentRole
      ? `Currently working as ${cvData.currentRole}.`
      : ""
    } Demonstrates strong technical and problem-solving skills.`;
};

const generateStrengths = (cvData) => {
  const s = [];
  if (cvData.yearsOfExperience >= 3) s.push("Strong industry experience");
  if (cvData.skills.length >= 5) s.push("Wide technical skill set");
  if (cvData.currentRole) s.push("Currently active in industry");
  return s.length ? s : ["Well-structured resume", "Good fundamentals"];
};

const generateRecommendations = (score) => {
  if (score >= 80)
    return ["Schedule technical interview", "Evaluate culture fit"];
  if (score >= 60)
    return ["Conduct screening call", "Verify skill depth"];
  return ["Consider junior role", "Review learning potential"];
};

/* =========================================================
   MAIN: Upload-based summarization
========================================================= */

export const summarizeUpload = async ({
  fileBuffer,
  filename,
  jobPosition,
  applicationId,
}) => {
  if (!fileBuffer) throw new Error("File buffer missing");

  const ext = filename.split(".").pop().toLowerCase();
  let text = "";

  if (ext === "pdf") text = await extractTextFromPDF(fileBuffer);
  else if (ext === "docx" || ext === "doc")
    text = await extractTextFromDOCX(fileBuffer);
  else throw new Error("Unsupported file type");

  if (!text || text.length < 50)
    throw new Error("Unable to extract CV text");

  const cvData = parseCV(text);
  const matchScore = calculateMatchScore(cvData, jobPosition);

  const summary = {
    id: generateId(),
    name: cvData.name || "Unknown Candidate",
    email: cvData.email || "Not available",
    phone: cvData.phone || "Not available",
    experience:
      cvData.yearsOfExperience > 0
        ? `${cvData.yearsOfExperience} years`
        : "Entry level",
    currentRole: cvData.currentRole || "Not specified",
    currentCompany: cvData.currentCompany || "Not specified",
    education:
      cvData.education[0] || "Not specified",
    skills: cvData.skills.length ? cvData.skills : ["General skills"],
    summary: generateSummary(cvData, jobPosition),
    matchScore,
    strengths: generateStrengths(cvData),
    recommendations: generateRecommendations(matchScore),
    jobPosition,
    applicationId,
    processedAt: new Date().toISOString(),
    date: new Date().toISOString(),
  };

  return {
    success: true,
    summary,
    metadata: {
      model: "cv-parser-v1",
      textLength: text.length,
    },
  };
};

/* =========================================================
   URL-based summarization
========================================================= */

export const summarizeFromUrl = async ({
  cvUrl,
  jobPosition,
  applicationId,
}) => {
  let buffer;
  let filename;

  if (cvUrl.startsWith("http")) {
    const res = await axios.get(cvUrl, { responseType: "arraybuffer" });
    buffer = Buffer.from(res.data);
    filename = cvUrl.split("/").pop();
  } else {
    // Handle relative path (local file)
    // Remove leading slash if present to avoid absolute path confusion, though path.join handles it
    // But we want to ensure it's relative to public/
    // actually path.join(cwd, 'public', '/uploads') works fine in node
    const filePath = path.join(process.cwd(), "public", cvUrl);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Resume file not found on server: ${cvUrl}`);
    }

    buffer = await fs.promises.readFile(filePath);
    filename = path.basename(filePath);
  }

  return summarizeUpload({
    fileBuffer: buffer,
    filename,
    jobPosition,
    applicationId,
  });
};

/* =========================================================
   Plain text summarization
========================================================= */

export const summarizeFromText = async ({
  text,
  jobPosition,
  applicationId,
}) => {
  if (!text || text.length < 20)
    throw new Error("Text too short");

  const cvData = parseCV(text);
  const score = calculateMatchScore(cvData, jobPosition);

  return {
    success: true,
    summary: {
      id: generateId(),
      name: cvData.name || "Unknown Candidate",
      email: cvData.email || "Not available",
      phone: cvData.phone || "Not available",
      experience: `${cvData.yearsOfExperience || 0} years`,
      currentRole: cvData.currentRole || "Not specified",
      currentCompany: cvData.currentCompany || "Not specified",
      education: cvData.education[0] || "Not specified",
      skills: cvData.skills,
      summary: generateSummary(cvData, jobPosition),
      matchScore: score,
      strengths: generateStrengths(cvData),
      recommendations: generateRecommendations(score),
      jobPosition,
      applicationId,
      processedAt: new Date().toISOString(),
    },
  };
};

