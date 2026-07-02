# Jira issues to create for the show-and-tell

Create these 5 issues in your Jira project **KAN** (aakashangadi.atlassian.net). Total time: ~10 minutes.

For each issue in Jira: click **Create** (top nav) → set the fields below → **Create**.

---

## Issue 1 — Canonical file (the ONE the whole story anchors to)

- **Issue type:** Task
- **Summary:** `HO-3 fire · panel-cause · 4A · prior loss · canonical training file (CL-108214)`
- **Description:**

```
FNOL: Insured reports "popping sound, lights flickered for 5 seconds, then smoke from
the electrical panel area." HO-3 policy with Endorsement 4A confirmed on
declarations. Prior loss on file (2022 kitchen water event, unrelated cause family).

Reserve set $69,000 first-cut per pattern median. Held ALE conservative 10 days.
Issued ROR letter Day 3 after phone call with insured.

Origin report Day 9 confirmed panel-cause. Model FPE Stab-Lok — active recall match.
Opened subrogation SUB-0142-2026. Preserved panel with chain-of-custody documentation.

Released ROR Day 11 after same-day phone call to insured. Payment $95,300 issued.
Manufacturer notified via certified mail.

This is the canonical file for the retirement handoff playbook. Every element of the
4A + prior + panel pattern is present.
```

- **Labels:** `fire, HO-3, endorsement-4A, panel-cause, prior-loss, subrogation-open, canonical-training-file`
- After creating: Transition status → **Done**

---

## Issue 2 — The wiring reclassification exception (why Day 10 review is mandatory)

- **Issue type:** Task
- **Summary:** `HO-3 fire · initially panel · reclassified to branch wiring on Day 8 (CL-105412)`
- **Description:**

```
FNOL read as clean panel-cause. Reserve set $58,000 first-cut per pattern median.
Held ALE conservative.

Day 8: fire marshal report reclassified cause from panel to branch wiring in
adjacent circuit. This is why Day 10 review must be MANDATORY, not marked.

Reserve upward revision to $79,600 (37% increase). Consistent with playbook
exception ex1 — wiring cases historically escalate.

Preserved wiring evidence chain. No manufacturer recall path but subro against
electrician who did prior remodel work is being pursued.
```

- **Labels:** `fire, HO-3, endorsement-4A, cause-reclassified, branch-wiring, exception-case`
- After creating: **Done**

---

## Issue 3 — The unrelated-prior exception (Judge pattern, not count)

- **Issue type:** Task
- **Summary:** `HO-3 fire · panel · 4A · unrelated prior loss (CL-106011)`
- **Description:**

```
FNOL panel-cause signature clean. HO-3 with 4A present. Prior loss on file
BUT — 2021 small kitchen water event. Unrelated cause family.

Decision: do NOT issue ROR. Prior loss trigger requires related cause family
for the ROR pattern to hold. This is playbook exception ex2.

Reserve $65,000 first-cut. Standard 10-day ALE hold. Origin cleared panel-cause
on Day 11. Payment $68,200 issued clean, no ROR.

Lesson: judge the pattern, not just the count. Prior loss alone is not a
trigger — related cause family + 4A + panel are required for the ROR fork.
```

- **Labels:** `fire, HO-3, endorsement-4A, panel-cause, prior-loss-unrelated, exception-case`
- After creating: **Done**

---

## Issue 4 — The no-4A recall path (preserve panel anyway)

- **Issue type:** Task
- **Summary:** `HO-3 fire · panel-cause · NO endorsement 4A · panel preserved for recall subro (CL-108450)`
- **Description:**

```
Small kitchen fire. HO-3 policy but no Endorsement 4A (no dwelling extension).
Panel model in active FPE Stab-Lok recall.

Junior instinct: no 4A, no big exposure, skip preservation. WRONG.

Manufacturer recall subrogation is available regardless of endorsement.
4A affects dwelling extension exposure only, not the mechanical subro path.
Preserving panel is cheap; burning subro is expensive.

Preserved panel with chain of custody. Opened SUB-0143-2026.
Reserve set $18,400. Small file. Recall recovery expected.

This is playbook exception ex3 — preserve panel on ALL panel-cause fires
regardless of endorsement.
```

- **Labels:** `fire, HO-3, panel-cause, no-endorsement-4A, subrogation-open, exception-case, training-priority`
- After creating: **Done**

---

## Issue 5 — Fresh 2026 canonical file (proves the pattern still holds)

- **Issue type:** Task
- **Summary:** `HO-3 fire · panel · 4A · prior loss · manufacturer recall confirmed (CL-108500)`
- **Description:**

```
2026 file demonstrating the panel-cause pattern still holds cleanly.

FNOL: "loud pop, lights flickered five seconds, then smoke from electrical
service entrance." HO-3 with 4A. Prior loss 2023 (related, small kitchen grease).

Reserve $68,000 first-cut per pattern median. Held ALE 10 days.
Phone-first ROR Day 3.

Origin Day 9 confirmed FPE Stab-Lok panel — active recall.
Subrogation SUB-0155-2026 opened. Panel preserved.

Released ROR Day 11 after same-day phone call. Payment $95,300 issued.

Handled by junior adjuster Sarah Lin under my supervision as part of the
retirement handoff. Sarah closed in ~6 minutes using the Knowledge Copilot
recommendation. Standard practice would have been 60-120 minutes.
```

- **Labels:** `fire, HO-3, endorsement-4A, panel-cause, prior-loss, subrogation-open, handoff-demo`
- After creating: **Done**

---

## After you're done in Jira

Return to your app → Run flow → step to **Archivist** → the Jira tab should now show all 5 issues with LIVE badge. Downstream steps (Extractor, Playbook) will now reference your actual Jira keys as sources.
