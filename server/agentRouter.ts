import { Router, type Request, type Response } from "express";
import {
  formatGeminiError,
  handleAgentChat,
  handleAgentTranscribe,
} from "./agentCore.mjs";

export function createAgentRouter(): Router {
  const router = Router();

  router.post("/chat", async (req: Request, res: Response) => {
    try {
      const result = await handleAgentChat(req.body);
      return res.json(result);
    } catch (err) {
      console.error("Agent chat error:", err);
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  router.post("/transcribe", async (req: Request, res: Response) => {
    try {
      const result = await handleAgentTranscribe(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error("Agent transcribe error:", err);
      if (err?.statusCode === 400) {
        return res.status(400).json({ error: err.message });
      }
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  return router;
}
