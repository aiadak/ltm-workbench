// /api/graph.js — REAL · Graph Builder
// Sonnet proposes typed nodes + directional labeled edges from Extractor JSON.
// Every edge carries provenance and confidence.

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are the Graph Builder for the LTM Workbench.
Given extraction JSON (entities, decision_rules, exception_patterns, heuristics), produce a typed knowledge graph.

NODE TYPES (choose from): Claim, Rule, Exception, Person, Action, Entity
EDGE TYPES (choose from): hasLossType, coveredBy, hasEndorsement, triggers, guardedBy, defines, requires, authoredBy, approvedBy, resolvesWith

Return strict JSON:
{
  "meta": {"nodes": <int>, "edges": <int>, "confidence_avg": <0..1>, "asserted_share": <0..1>},
  "nodes": [{"id": "n_<slug>", "type": "<NodeType>", "label": "..."}],
  "edges": [{"from": "n_<slug>", "to": "n_<slug>", "label": "<EdgeType>", "solid": <bool>, "confidence": <0..1>, "sources": ["<source id>"]}]
}
Rules:
- solid=true iff the edge is directly asserted by a source in the extraction; solid=false for inferred edges.
- Every edge MUST carry at least one source pointer from the extraction.
- Keep node IDs short and slugged (n_claim_fire, n_rule_ror, etc.).
- Return JSON only, no prose.`;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf-8"));
}
function loadCache() {
  return {
    meta: readJson("data/fixtures.json").graph.meta,
    nodes: readJson("data/fixtures.json").graph.nodes,
    edges: readJson("data/fixtures.json").graph.edges,
  };
}
function loadExtraction() {
  return readJson("data/cache/extraction.json");
}

export default async function handler(req, res) {
  const extraction = (req.body && req.body.extraction) || loadExtraction();

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_api_key");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(extraction) }],
    });
    const text = msg.content[0]?.text || "";
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json({ source: "live", data: parsed });
  } catch (err) {
    console.error("[graph] API failure, serving cache:", err.message);
    return res.status(200).json({ source: "cache", data: loadCache() });
  }
}
