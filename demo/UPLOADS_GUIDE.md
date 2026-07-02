# What to upload where

The Archivist agent accepts four source types. Some are live via API, some are auto-loaded from fixtures, some you upload during the demo.

| Source | How it works | Files to use |
| --- | --- | --- |
| **Jira** | LIVE from your Atlassian workspace via REST API. Nothing to upload. | Create issues per `demo/JIRA_ISSUES.md` — the Archivist picks them up automatically. |
| **Confluence** | LIVE from your `Workbench_SME` space via REST API. Or upload extras. | Author pages per `demo/CONFLUENCE_PAGES.md`, OR upload `demo/confluence-extra-pages.json` if you don't want to author live. |
| **ServiceNow** | Auto-loaded from `data/sources/servicenow.json`. Upload to replace. | `demo/servicenow-fire-claims.json` is a pre-built alternative you can drop in. |
| **Teams transcripts** | Upload during the demo. | `demo/teams-mike-thread.txt` (or `.md`) — plain text chat log, format: `Name [YYYY-MM-DD]: message` |

## During the demo

1. Click **▶ Run pipeline** on the Agent Dashboard
2. When Archivist expands, open the blue **📁 Files you can upload here** panel
3. Click **Choose Files** and drop in:
   - `teams-mike-thread.txt`
   - `confluence-extra-pages.json` (optional)
   - `servicenow-fire-claims.json` (optional — replaces the auto-loaded)
4. Watch the source counts jump with `+N uploaded` badges
5. Click **Next → Extractor** — Claude extracts rules citing your Jira issue keys and the uploaded content
6. Downstream (Graph, Playbook, Coach) all read from that same pipeline output

## What's REAL vs simulated

- **Jira / Confluence** — real REST reads from your Atlassian workspace (creds required)
- **Archivist normalization** — real Haiku call maps source-native schemas into the unified ticket record
- **Extractor / Graph / Playbook / Reviewer / Coach** — real Sonnet or Haiku calls, all reading from Archivist output
- **Observer / Interviewer / Scenario / Analysis / Planner / Knowledge Copilot** — polished demo previews (MOCK)

## Reset between run-throughs

- Refresh the browser tab — session uploads clear
- Or open DevTools → Application → Session Storage → delete keys starting `ltm_`
