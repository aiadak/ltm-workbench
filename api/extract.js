// /api/extract.js — REAL · Extractor
// Reactive: if POST body includes archivist output, extract from those live records.
// Otherwise, fall back to fixture ticket + transcript.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are an extraction agent for insurance claims knowledge.
Extract only what is grounded in the provided sources. Return strict JSON with this exact shape:
{
  "entities": [{"name": "...", "type": "...", "source": "..."}],
  "decision_rules": [{"if": "...", "then": "...", "source": "..."}],
  "exception_patterns": [{"pattern": "...", "resolution": "...", "source": "..."}],
  "heuristics": [{"text": "...", "invoked_when": "...", "source": "..."}]
}
Rules: never invent entities; every item MUST carry a source pointer (use the actual Jira key, Confluence page id, or fixture id); use the SME's own language for heuristics where quotes are available; return JSON only — no prose, no markdown fences.`;

function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf-8")); }
function loadCache() { return readJson("data/cache/extraction.json"); }
function loadFixtures() { return readJson("data/fixtures.json"); }

function summarizeJiraIssue(iss) {
  const f = iss.fields || {};
  const desc = typeof f.description === "string" ? f.description : (f.description?.content?.[0]?.content?.[0]?.text || "");
  const comments = (f.comment?.comments || []).map(c => `[${c.author?.displayName || "unknown"}] ${c.body?.content?.[0]?.content?.[0]?.text || c.body || ""}`).join(" | ");
  return {
    id: iss.key,
    summary: f.summary,
    labels: f.labels,
    resolution: f.resolution?.name,
    description: desc,
    comments,
  };
}

function summarizeConfluencePage(p) {
  const html = p.body?.storage?.value || "";
  const text = html.replace(/<[^>]+>/g, "").slice(0, 2000);
  return { id: p.id, title: p.title, labels: p.labels, text };
}

export default async function handler(req, res) {
  const fixtures = loadFixtures();
  const body = req.body || {};
  const archivist = body.archivist;

  let sourceMaterial = "";
  if (archivist && (archivist.source_records?.jira?.issues?.length || archivist.source_records?.confluence?.results?.length)) {
    const jira = (archivist.source_records.jira.issues || []).slice(0, 6).map(summarizeJiraIssue);
    const conf = (archivist.source_records.confluence.results || []).slice(0, 6).map(summarizeConfluencePage);
    sourceMaterial = `LIVE ARCHIVIST SWEEP\n\nJIRA ISSUES (${jira.length}):\n${JSON.stringify(jira, null, 2)}\n\nCONFLUENCE PAGES (${conf.length}):\n${JSON.stringify(conf, null, 2)}`;
  } else {
    const focusTicket = fixtures.tickets.find(t => t.id === "CL-108214") || fixtures.tickets[0];
    const transcript = fixtures.transcripts[0];
    sourceMaterial = `FIXTURE TICKET (${focusTicket.id}):\n${JSON.stringify(focusTicket, null, 2)}\n\nINTERVIEW TRANSCRIPT (${transcript.id}):\n${transcript.excerpt}`;
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_api_key");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: sourceMaterial }],
    });
    const text = msg.content[0]?.text || "";
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json({ source: "live", data: parsed });
  } catch (err) {
    console.error("[extract] API failure, serving cache:", err.message);
    return res.status(200).json({ source: "cache", data: loadCache() });
  }
}
