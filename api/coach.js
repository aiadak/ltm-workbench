// /api/coach.js — REAL · Coach
// Reads the LIVE Playbook (the source of truth) + transcript + tickets.
// If uploaded documents are in the POST body, incorporates them.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are the Coach agent for the LTM Workbench.
The Playbook is the single source of truth for what the trainee needs to learn. Given the approved Playbook (SOPs, resolved tickets, scenarios, exception library), transcript, and any uploaded documents, generate:
- 5 practice questions with answer keys, grounded in the Playbook's SOPs and exceptions.
- 5 micro-lessons (5–10 min each) covering the highest-leverage SOPs and exceptions.
- A calendar schedule delivering these over ~3 weeks (mornings, alternating lesson/question).
Return strict JSON:
{
  "trainee": "...",
  "based_on": ["<Playbook id>", "<transcript id>", ...],
  "questions": [{"id": "q1", "prompt": "...", "answer_key": "...", "difficulty": "easy|medium|hard", "sources": ["<Playbook SOP #N>", ...]}],
  "micro_lessons": [{"id": "ml1", "title": "...", "duration_min": <int>, "summary": "...", "sources": ["..."]}],
  "schedule": [{"date": "YYYY-MM-DD", "time": "HH:MM", "item": "<id>", "kind": "micro_lesson|practice_question"}],
  "note": "Calendar writes are stubbed for this demo."
}
Return JSON only, no prose.`;

function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf-8")); }
function loadCache() { return readJson("data/cache/coach.json"); }
function loadFixtures() { return readJson("data/fixtures.json"); }
function loadPlaybookCache() { return readJson("data/cache/playbook.json"); }

export default async function handler(req, res) {
  const fixtures = loadFixtures();
  const body = req.body || {};
  const playbook = body.playbook || loadPlaybookCache();
  const uploadedDocs = body.uploadedDocs || [];

  const uploadedSection = uploadedDocs.length
    ? `\nUPLOADED DOCUMENTS (${uploadedDocs.length}):\n${uploadedDocs.map(d => `— ${d.name}: ${(d.content || "").slice(0, 1500)}`).join("\n")}`
    : "";

  const userPrompt = `TRAINEE: ${fixtures.trainee.name} (${fixtures.trainee.role})

APPROVED PLAYBOOK (source of truth):
${JSON.stringify(playbook, null, 2)}

TRANSCRIPT EXCERPT (${fixtures.transcripts[0].id}):
${fixtures.transcripts[0].excerpt}
${uploadedSection}

Generate the coaching plan. Reference Playbook SOPs and exceptions in the answer_key and sources fields.`;

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_api_key");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = msg.content[0]?.text || "";
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json({ source: "live", data: parsed });
  } catch (err) {
    console.error("[coach] API failure, serving cache:", err.message);
    return res.status(200).json({ source: "cache", data: loadCache() });
  }
}
