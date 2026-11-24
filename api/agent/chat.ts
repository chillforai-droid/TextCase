import { formatGeminiError, handleAgentChat } from "../../server/agentCore.mjs";

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const result = await handleAgentChat(body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Vercel agent chat error:", err);
    const formatted = formatGeminiError(err);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
