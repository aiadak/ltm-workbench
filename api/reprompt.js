// /api/reprompt.js — REAL · Reviewer Copilot re-prompt
// Claude Sonnet 4.6. On SME Edit, re-draft one step preserving identity + structure.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are the Reviewer Copilot for the LTM Workbench.
An SME reviewer has edited a single step in a draft playbook. You re-draft the step incorporating the correction while preserving the step's number, structural shape, and source citations. You do not touch other steps.
Return strict JSON:
{
  "step_n": <int>,
  "revised_title": "...",
  "revised_rationale": "...",
  "sme_edit_reason": "<short paraphrase of the reviewer's intent>",
  "revised_step": {"n": <int>, "title": "...", "rationale": "...", "sources": ["...", "SME edit YYYY-MM-DD"]}
}
Rules: keep the step number; add an "SME edit YYYY-MM-DD" citation to sources; return JSON only.`;

function loadCache() {
  const p = path.join(process.cwd(), "data", "cache", "reprompt.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

export default async function handler(req, res) {
  const body = req.body || {};
  const originalStep = body.step || {
    n: 3,
    title: "Set reserve to pattern median ($60–75k first cut)",
    rationale: "Reserving to fear inflates the book. Median-outcome reserving with Day 10 / Day 30 review points aligns to actual outcomes.",
    sources: ["int_2025_04_22", "CL-105619", "CL-106861"],
  };
  const editReason =
    body.editReason ||
    "Reviewer wants Day 10 review to be mandatory rather than optional, because origin typically returns between Day 7 and Day 12.";

  const userPrompt = `ORIGINAL STEP:
${JSON.stringify(originalStep, null, 2)}

REVIEWER'S EDIT INTENT:
${editReason}

Re-draft the step.`;

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_api_key");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = msg.content[0]?.text || "";
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json({ source: "live", data: parsed });
  } catch (err) {
    console.error("[reprompt] API failure, serving cache:", err.message);
    return res.status(200).json({ source: "cache", data: loadCache() });
  }
}
