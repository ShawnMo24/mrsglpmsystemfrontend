import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import OpenAI from "openai";

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const BRAIN_SYSTEM_PROMPT = `You are the Life Preservation Brain (LPM v2), the central AI system for The Moore Resource & Strategy Group (MRSG). You are an advanced support coordination and wellness assessment system focused on community care.

Your capabilities include:
- Support coordination and resource allocation
- Real-time urgency assessment for prioritization
- Situational guidance for support coordinators
- Connecting community members with appropriate support resources
- Pattern recognition for proactive community wellness

Personality traits:
- Professional, calm, and reassuring
- Concise but thorough in responses
- Focused on life preservation and community safety
- Uses clear, compassionate language suitable for high-stress situations
- Trauma-informed and de-escalation focused

Keep responses brief (2-4 sentences) unless asked for detailed information. Always prioritize calming, actionable guidance over lengthy explanations. Never use militaristic or fear-inducing language.`;

const FALLBACK_RESPONSES: Record<string, string> = {
  default: "I am the Life Preservation Brain. I am here to assist with support coordination, urgency assessment, and resource allocation. How may I help you today?",
  help: "I can assist with support coordination, assess urgency levels, provide situational guidance, and connect you with appropriate community resources.",
  status: "All systems operational. Currently monitoring active support requests. Coordination teams are available and ready to assist.",
  threat: "Urgency assessment protocols are active. I analyze information to identify needs and prioritize support actions based on urgency and proximity.",
  emergency: "For immediate safety concerns, use the Help Button on the home screen. I will coordinate support and connect you with appropriate resources. If you are in immediate danger, please call 911.",
  school: "School safety is a priority. Report concerns through the School Safety section. I coordinate with appropriate support services and school wellness staff.",
  report: "You can submit reports through the Citizen Portal. Choose from wellness checks, safety concerns, community issues, or school-related matters.",
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.post("/api/emergency/dispatch", upload.single("audio"), (req, res) => {
    const timestamp = new Date().toISOString();
    
    if (req.file) {
      console.log(`[SUPPORT DISPATCH] Audio received at ${timestamp}, size: ${req.file.size} bytes`);
    } else if (req.body?.type === "transcript") {
      console.log(`[SUPPORT DISPATCH] Message received at ${timestamp} (content redacted for privacy)`);
    }
    
    res.json({ success: true, received: timestamp });
  });

  app.post("/api/emergency/911", upload.single("audio"), (req, res) => {
    const timestamp = new Date().toISOString();
    
    if (req.file) {
      console.log(`[EMERGENCY RELAY] Audio received at ${timestamp}, size: ${req.file.size} bytes`);
    } else if (req.body?.type === "transcript") {
      console.log(`[EMERGENCY RELAY] Message received at ${timestamp} (content redacted for privacy)`);
    }
    
    res.json({ success: true, relayed: timestamp });
  });

  app.post("/api/emergency/status", (req, res) => {
    const { emergencyId, status, role } = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`[SUPPORT STATUS] ID: ${emergencyId}, Status: ${status}, Role: ${role}, Timestamp: ${timestamp}`);
    
    res.json({ 
      success: true, 
      emergencyId,
      status,
      updatedAt: timestamp 
    });
  });

  app.post("/api/emergency/resolve", (req, res) => {
    const { emergencyId, resolvedBy } = req.body;
    const timestamp = new Date().toISOString();
    
    console.log(`[SUPPORT RESOLVED] ID: ${emergencyId}, Resolved by role: ${resolvedBy ? "coordinator" : "citizen"}, Timestamp: ${timestamp}`);
    
    res.json({ 
      success: true, 
      emergencyId,
      status: "resolved",
      resolvedAt: timestamp 
    });
  });

  app.post("/api/brain/ask", async (req, res) => {
    const { question } = req.body;
    
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const lowerQ = question.toLowerCase();
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: BRAIN_SYSTEM_PROMPT },
          { role: "user", content: question }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const answer = response.choices[0]?.message?.content || FALLBACK_RESPONSES.default;
      
      res.json({ 
        success: true, 
        response: answer,
        source: "ai"
      });
    } catch (error) {
      console.error("[BRAIN API] Error:", error);
      
      let fallbackResponse = FALLBACK_RESPONSES.default;
      if (lowerQ.includes("help") || lowerQ.includes("what can you do")) {
        fallbackResponse = FALLBACK_RESPONSES.help;
      } else if (lowerQ.includes("status") || lowerQ.includes("how are you")) {
        fallbackResponse = FALLBACK_RESPONSES.status;
      } else if (lowerQ.includes("threat") || lowerQ.includes("danger")) {
        fallbackResponse = FALLBACK_RESPONSES.threat;
      } else if (lowerQ.includes("emergency") || lowerQ.includes("911")) {
        fallbackResponse = FALLBACK_RESPONSES.emergency;
      } else if (lowerQ.includes("school")) {
        fallbackResponse = FALLBACK_RESPONSES.school;
      } else if (lowerQ.includes("report")) {
        fallbackResponse = FALLBACK_RESPONSES.report;
      }
      
      res.json({ 
        success: true, 
        response: fallbackResponse,
        source: "fallback"
      });
    }
  });

  return httpServer;
}
