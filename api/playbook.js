// /api/playbook.js — REAL · Playbook Composer
// Claude Sonnet 4.6. The Playbook is the single source of truth.
// Includes SOPs, resolved-tickets table, ticket→scenario mapping, exception library, approval trail.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are the Playbook Composer for the LTM Workbench.
The Playbook is the single source of truth for downstream agents (Coach, Copilot). It composes the SME's captured judgment into an operational reference.

Given the extraction JSON, ticket corpus, and (if provided) prior approval trail, return strict JSON:
{
  "id": "pb_<slug>_v<n>_DRAFT",
  "title": "...",
  "version": "<n>.0",
  "status": "DRAFT",
  "author_sme": "...",
  "applicability": ["<criterion>", ...],
  "sops": [
    { "n": 1, "title": "...", "trigger": "when to invoke", "steps": ["step text", ...], "rationale": "why", "sources": ["..."] }
  ],
  "reserve_guidance": {"first_cut": {"low": <n>, "median": <n>, "high": <n>}, "review_points": [...], "notes": "..."},
  "resolved_tickets": [
    { "id": "<CLAIM-XXX>", "pattern": "<short pattern name>", "reserve_final": <n>, "outcome": "...", "lesson": "one-line takeaway" }
  ],
  "ticket_scenario_mapping": [
    { "scenario_id": "sc1", "scenario_label": "...", "difficulty": "easy|medium|hard", "grounded_in": ["<CLAIM-XXX>", "..."], "expected_reasoning": "..." }
  ],
  "exception_library": [
    { "id": "ex1", "trigger": "when this signal appears", "response": "what to do", "sources": ["..."] }
  ],
  "approval_trail": [
    { "ts": "<iso>", "reviewer": "...", "action": "approve|edit|reject", "target": "<sop|reserve_guidance|scenario|exception>:<id>", "note": "..." }
  ]
}
Rules: status is ALWAYS "DRAFT" on generation; SOPs cover the primary decision paths (aim for 3–6); every resolved_ticket carries a one-line lesson; scenario mapping shows how tickets seeded each scenario; every exception has a source; approval_trail starts empty on first draft. Return JSON only.`;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf-8"));
}
function loadCache() { return readJson("data/cache/playbook.json"); }
function loadFixtures() { return readJson("data/fixtures.json"); }
function loadExtractionCache() { return readJson("data/cache/extraction.json"); }

export default async function handler(req, res) {
  const fixtures = loadFixtures();
  const extraction = (req.body && req.body.extraction) || loadExtractionCache();
  const priorTrail = (req.body && req.body.approvalTrail) || [];

  const userPrompt = `SME: ${fixtures.sme.name} (${fixtures.sme.role})
DOMAIN: ${fixtures.sme.domain}
SIGNATURE PATTERN: Fire · Panel-cause · Endorsement 4A · Prior Loss History

EXTRACTION JSON (source of truth):
${JSON.stringify(extraction, null, 2)}

TICKET CORPUS (${fixtures.tickets.length} tickets):
${JSON.stringify(fixtures.tickets.slice(0, 10), null, 2)}
... plus ${Math.max(0, fixtures.tickets.length - 10)} more.

PRIOR APPROVAL TRAIL (may be empty on first draft):
${JSON.stringify(priorTrail, null, 2)}

Compose the Playbook. Include SOPs for: (1) recognizing pattern from FNOL, (2) reserve setting discipline, (3) ROR communication, (4) subrogation & evidence preservation. Include 3 scenarios (easy/medium/hard) with ticket grounding. Include the exception library from the extraction.`;

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_api_key");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = msg.content[0]?.text || "";
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.status !== "DRAFT") parsed.status = "DRAFT";
    return res.status(200).json({ source: "live", data: parsed });
  } catch (err) {
    console.error("[playbook] API failure, serving cache:", err.message);
    return res.status(200).json({ source: "cache", data: loadCache() });
  }
}
