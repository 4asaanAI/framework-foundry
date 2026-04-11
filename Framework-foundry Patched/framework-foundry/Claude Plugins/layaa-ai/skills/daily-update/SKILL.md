---
name: daily-update
description: >
  Daily company check-in and feedback loop for Layaa AI. Asks about company
  updates, content usage, client changes, and upcoming events. Updates
  reference docs and memory based on responses. Tracks whether generated
  content was actually posted and captures corrections for future improvement.
  This is a new Layaa AI-specific skill.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Daily Update — Layaa AI Check-In & Feedback Loop

## Purpose

This skill runs a structured daily check-in to keep Layaa AI's knowledge base current and close the feedback loop on generated content. It ensures Claude always has the latest company context.

## Execution Steps

### Step 1: Ask Company Updates

Ask the user about each category (skip categories they say "no changes" to):

1. **New Clients & Pipeline**
   - Any new leads, proposals sent, deals closed, or deals lost?
   - Any client feedback or complaints?
   - Any client upgrades, downgrades, or churn?

2. **Pricing & Revenue Changes**
   - Any pricing adjustments or new package configurations?
   - Any invoices sent, payments received, or overdue payments?

3. **Team & Operations**
   - Any new hires, role changes, or team updates?
   - Any new tools, platforms, or process changes?
   - Any delivery milestones hit or issues encountered?

4. **Partnerships & Market**
   - Any new partnerships, referral agreements, or vendor relationships?
   - Any competitive intelligence or market developments?

5. **Strategic Updates**
   - Any pivots in strategy, new service offerings, or market focus changes?
   - Any investor conversations or fundraising updates?

6. **Compliance & Legal**
   - Any filings due, regulatory changes, or legal matters?

### Step 2: Content Feedback Loop

Ask about content generated in recent sessions:

1. **Was yesterday's/recent content posted?**
   - If YES: Note which pieces were used. Ask if any edits were made before posting.
   - If NO: Ask why not (not relevant, needs changes, didn't get to it, quality issue).
   - Flag content not posted for 3+ days as stale.

2. **Any corrections or feedback on generated content?**
   - Capture specific corrections (tone was off, facts wrong, too long, etc.)
   - Save as feedback memory for future improvement.

3. **Any content needs for today/this week?**
   - Upcoming posts, emails, proposals, or documents needed.

### Step 3: Upcoming Context

1. **Meetings, pitches, or demos this week?**
   - Client names, topics, preparation needed.

2. **Deadlines or events approaching?**
   - Filing deadlines, launch dates, conference appearances.

### Step 4: Process Updates

Based on user responses, take these actions:

1. **Update reference docs** — If company details changed (new pricing, new client, new tool), update the relevant file in `shared-references/` or `domain-references/`.

2. **Save to memory** — If the update is useful for future conversations:
   - Company changes → project memory
   - Content feedback → feedback memory
   - User preferences discovered → user memory

3. **Log the check-in** — Append a dated entry to `shared-references/update-log.md` with a summary of what changed.

4. **Flag stale content** — If generated content wasn't posted for 3+ days, note it and ask if the content strategy needs adjustment.

### Step 5: Summary

Provide a brief summary:
- Changes captured and where they were saved
- Action items identified
- Content pipeline status
- Upcoming deadlines or meetings flagged

## Output Format

```
## Daily Update — [Date]

### Changes Captured
- [List of updates and where each was saved]

### Content Status
- Posted: [list]
- Pending: [list]
- Stale (3+ days): [list]

### Feedback Applied
- [Corrections saved to memory]

### Action Items
- [Tasks identified from the check-in]

### Upcoming
- [Meetings, deadlines, events this week]
```

## Notes

- Keep the check-in conversational and quick — aim for 5 minutes
- Don't ask about categories the user has already addressed
- If user says "no updates," accept it and move on
- Always save feedback corrections to memory — this is how content quality improves over time
- Create `shared-references/update-log.md` on first run if it doesn't exist
