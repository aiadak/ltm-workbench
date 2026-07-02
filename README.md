# LTM Workbench v10 — Travelers

**Single-file HTML build with unified Agent Dashboard and reactive pipeline.**

## What's new in v10

- **Overview renamed to Agent Dashboard.** Click any agent card to run it inline.
- **▶ Run pipeline** button — activates the first agent, gently pulses it, walk the whole story with Next.
- **Reactive pipeline** — Archivist output feeds Extractor; Extractor feeds Graph + Playbook; Playbook feeds Reviewer + Coach. Uploads on Archivist and Coach propagate downstream on the next Next click.
- **Rich REAL scenes** restored: Archivist upload panel (Teams `.txt`, Confluence `.json`, ServiceNow `.json`), Playbook full rendering (SOPs, tickets table, exceptions), Reviewer with functional Approve/Edit/Reject persisting to sessionStorage, Coach upload for questions/lessons regeneration.

## Uploads

See `demo/UPLOADS_GUIDE.md` for the full guide. Short version:

- **Jira** — LIVE from your Atlassian workspace, no upload needed
- **Confluence** — LIVE from your space, OR upload `demo/confluence-extra-pages.json`
- **ServiceNow** — auto-loaded, OR upload `demo/servicenow-fire-claims.json`
- **Teams transcripts** — upload `demo/teams-mike-thread.txt` or `.md`

## Deploy

1. Push this folder to GitHub (must include `api/`, `data/`, `demo/` folders!)
2. Import to Vercel → framework **Other**
3. Env vars: `ANTHROPIC_API_KEY`, `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_TOKEN`, `JIRA_PROJECT_KEY`, `CONFLUENCE_SPACE_KEY`
4. Deploy → open in incognito

## Files

- `index.html` — the whole app (single file, everything inline)
- `api/` — 6 serverless endpoints calling Claude + Atlassian REST
- `data/` — fixtures, cache fallback, synthetic source records
- `demo/` — pre-built JSON uploads + step-by-step Jira/Confluence content guides
