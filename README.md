# LTM Workbench v8 — Travelers

**Single-file HTML build.** All UI, state, and rendering logic live inside `index.html`. No separate `app.js` — nothing to truncate, nothing to sync between files. Just deploy and it works.

## Deploy

1. Push this folder to a fresh GitHub repo
2. Import into Vercel — framework preset **Other**
3. Add env vars: `ANTHROPIC_API_KEY`, `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_TOKEN`, `JIRA_PROJECT_KEY`, `CONFLUENCE_SPACE_KEY`
4. Deploy

## What ships

- `index.html` — Overview, Run flow, System Map, agent detail views, all inline
- `/api/` — 6 serverless endpoints (archivist, extract, graph, playbook, reprompt, coach) making genuine Claude API calls
- `/data/` — fixtures, cache fallback, source-native records
- `/demo/` — pre-filled JSON files ready to drag-drop for the show-and-tell

## What's REAL

Six agents make live Claude API calls: Archivist (Haiku normalization + Jira/Confluence REST reads), Extractor (Haiku), Graph Builder (Sonnet), Playbook Composer (Sonnet), Reviewer (Sonnet on Edit), Coach (Sonnet). Each has try/catch cache fallback — no red banners at demo.

## Constraints (from PRD)

- Static HTML is the deliverable. No React.
- Only dependency: `@anthropic-ai/sdk`.
- Playbook is the single source of truth for downstream agents.
