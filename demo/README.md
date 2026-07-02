# Demo pack — show-and-tell in ~20 minutes total

Everything you need for a convincing demo. Follow these in order.

## 30 minutes before the demo

**1. Populate Jira** — open **JIRA_ISSUES.md** in this folder. Create the 5 issues in your KAN project. ~10 min.

**2. Populate Confluence** — open **CONFLUENCE_PAGES.md**. Create the 4 pages in Workbench_SME. ~10 min.

## During the demo

Open your live app URL. Walk this order:

1. **Overview** — quick tour of the 12 agents, KPIs, four pillars.
2. **Run flow** → step through with the Next button.
3. **Observer, Interviewer** — mock scenes, click through.
4. **Archivist** — this is the money moment.
   - Show the "Live API endpoints" panel — the Jira and Confluence URLs are calling your real workspace
   - Show the source cards — Jira and Confluence say **LIVE · CONNECTED** with your record counts
   - Click **Upload supplemental records** → drop `servicenow-fire-claims.json` and `teams-mike-thread.json` from this folder
   - Watch the record counts jump, `+N uploaded` badges appear
5. **Extractor** — Claude Haiku extracts decision rules and heuristics from the Archivist output. Cite examples where the source is your actual Jira key.
6. **Graph Builder** — Sonnet proposes typed edges. Real Claude call.
7. **Playbook Composer** — Sonnet composes the SOPs, resolved-tickets table, ticket→scenario mapping, exception library.
8. **Scenario** — mock, click through.
9. **Reviewer** — click Approve on a few items, Edit on one (type a correction like "Day 10 review must be mandatory not marked" — Claude will re-draft the step).
10. **Analysis, Planner** — mock, click through.
11. **Coach** — Sonnet generates practice questions + micro-lessons grounded in the reviewed Playbook.
12. **Knowledge Copilot** — mock, close on the ~6-min ETA card.

## The "one thing to notice" for each agent

| Agent | The moment |
| --- | --- |
| Archivist | Live Jira JQL query URL visible; ServiceNow/Teams uploaded from this folder |
| Extractor | Heuristics quote Mike's language; sources cite your actual Jira keys |
| Graph Builder | LIVE badge, typed edges with confidence + provenance |
| Playbook | SOPs pull from your Confluence content; approval trail persists across reloads |
| Reviewer | Edit → live Sonnet re-draft, visible in the Playbook step next time |
| Coach | Questions cite Playbook SOP #N; syllabus updates when you upload docs |

## Reset between run-throughs

Browser DevTools → Application → Local Storage / Session Storage → delete `ltm_*` keys.
