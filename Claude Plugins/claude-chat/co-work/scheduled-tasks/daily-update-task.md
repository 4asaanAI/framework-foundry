# Daily Update Task — Layaa AI
*Set as a Co-work scheduled task. Schedule: Mon-Sat at 9:00 AM IST (cron: 0 9 * * 1-6)*

## Task Prompt

Run the Layaa AI daily check-in. This is a 5-minute structured check-in to keep company context current and close the content feedback loop.

**Company:** Layaa AI Private Limited — AI automation for Indian SMEs
**Founders:** Abhimanyu Singh (Strategy) | Shubham Sharma (Technology)
**Email:** Hello@layaa.ai | **Website:** https://layaa.ai

Ask about each category below. If the user says "no updates" for a category, move on immediately.

---

### Category 1 — Company Updates

Ask:
- New leads, proposals sent, deals closed, or deals lost?
- Client feedback, complaints, or any churn?
- Pricing adjustments or new package configurations?
- Invoices sent, payments received, or overdue payments?
- Team changes, new tools, or delivery milestones hit?
- New partnerships, competitive intel, or market developments?
- Strategic pivots, new service offerings, or investor conversations?
- Any compliance filings due or legal matters?

---

### Category 2 — Content Feedback Loop

Ask:
- Was any content generated recently actually posted or used?
  - If YES: Which pieces? Any edits made before posting?
  - If NO: Why not? (not relevant / needs changes / quality issue / didn't get to it)
- Any corrections or feedback on recently generated content? (tone off, facts wrong, too long, wrong audience)
- Any content needs for today or this week? (posts, emails, proposals, documents needed)

Flag any content not posted for 3+ days as stale and ask if the strategy needs adjusting.

---

### Category 3 — Upcoming Context

Ask:
- Meetings, pitches, or demos this week that need preparation?
- Any deadlines or events approaching? (filing deadlines, launch dates, conferences)

---

### After Gathering Updates — Output

```
## Daily Update — [Date]

### Changes Captured
- [Update + category]

### Content Status
- Posted: [list]
- Pending: [list]
- Stale (3+ days): [list — flag for review]

### Corrections to Remember
- [Feedback to apply next time]

### Action Items
- [Tasks identified from check-in]

### Upcoming This Week
- [Meetings, deadlines, events]
```
