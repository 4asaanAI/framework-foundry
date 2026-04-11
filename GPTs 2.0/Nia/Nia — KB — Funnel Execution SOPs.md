# Nia — Funnel Execution SOPs

**Owner:** Nia (Campaign & Funnel Execution Coordinator)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — SOP updates follow institutional memory process

---

## Campaign Launch SOP

### Pre-Launch Checklist (3-5 Days Before)
- [ ] Campaign brief reviewed and understood (from Mira)
- [ ] Channel blueprint reviewed (from Zoya)
- [ ] Content assets received and approved (from Tara)
- [ ] UTM tags created and documented
- [ ] Tracking pixels / conversion tags implemented
- [ ] Landing page tested (desktop + mobile)
- [ ] Email sequences loaded and tested (send test emails)
- [ ] CRM fields configured for new campaign leads
- [ ] Lead scoring rules confirmed with Yuvaan
- [ ] Budget allocated and approved (confirmed with Anne)
- [ ] Reporting dashboard or template prepared
- [ ] Timeline confirmed with all stakeholders

### Launch Day Checklist
- [ ] All campaign elements go live at scheduled time
- [ ] Verify tracking is firing correctly (check UTMs, conversion events)
- [ ] Verify landing pages are loading correctly
- [ ] Verify email sequences are triggering correctly
- [ ] First-hour monitoring: Check impressions, clicks, spend pacing
- [ ] Send launch confirmation to Mira and Zoya
- [ ] Log launch in campaign execution tracker

### Post-Launch Monitoring (First 48 Hours)
- [ ] Check key metrics at 24 hours and 48 hours
- [ ] Compare against benchmarks from Zoya
- [ ] Flag any anomalies (unusually high/low metrics)
- [ ] Confirm lead flow into CRM is working
- [ ] Report initial performance to Mira and Zoya

---

## Email Sequence Execution SOP

### Setup Phase
1. Receive email copy from Tara (confirmed for brand voice)
2. Load emails into automation platform
3. Set triggers: timing, conditions, audience criteria
4. Configure personalization fields (name, company, industry)
5. Set up A/B test if specified (subject lines, send times)
6. Create suppression rules (unsubscribed, bounced, already-converted)
7. Test entire sequence with internal email addresses
8. Verify all links, UTMs, tracking, and CTAs work

### Live Phase
1. Activate sequence at approved time
2. Monitor delivery rates (target >95%)
3. Monitor open rates at 24 hours
4. Monitor click-through rates at 48 hours
5. Flag any sequence with open rate <15% or CTR <1%
6. Monitor unsubscribe rate (flag if >1% on any single send)
7. Check spam complaint rate (flag if >0.1%)

### Optimization Phase
1. After full sequence completes for first cohort:
   - Report per-email performance (open, click, conversion)
   - Identify highest and lowest performing emails
   - Recommend changes to Mira (not implement independently)
2. A/B test results reviewed after statistical significance reached
3. Winning variants implemented for next cohort

---

## CRM Funnel Management SOP

### Lead Entry
- Every lead enters CRM with: name, email, company, source, campaign, UTM data, date, lead score
- Duplicate check before creation
- Auto-assign to correct pipeline stage based on source and behavior

### Stage Management
```
New Lead → MQL (Marketing Qualified) → SQL (Sales Qualified) → Proposal → Won/Lost
```

### Stage Transition Criteria

| From | To | Trigger |
|------|-----|---------|
| New Lead | MQL | Meets firmographic + behavioral scoring threshold |
| MQL | SQL | Confirmed fit by sales criteria (Yuvaan or founder review) |
| SQL | Proposal | Discovery call completed, proposal requested |
| Proposal | Won | Contract signed, payment received |
| Proposal | Lost | Rejected, no response after follow-up sequence |

### Hygiene Rules
- Leads stagnant in a stage for 30+ days: Flag for review
- Lost leads: Tag with reason (price, timing, fit, competitor, no response)
- Won leads: Transfer to client onboarding pipeline
- Review CRM data integrity monthly

---

## Funnel Drop-Off Reporting SOP

### Monitoring Frequency
Weekly minimum, daily for active campaigns

### Drop-Off Detection
1. Calculate conversion rate at each funnel stage
2. Compare against target benchmarks
3. Flag any stage where conversion is >20% below target

### Reporting Process
1. Use Drop-Off Report template (see dedicated KB file)
2. Include quantified data (not just "drop-off detected")
3. List probable causes ranked by likelihood
4. List recommended fixes ranked by expected impact and effort
5. Specify escalation needs
6. Submit report to Mira and Zoya

### Response Time
- Critical drop-off (>50% below target): Report within 24 hours
- Moderate drop-off (20-50% below target): Report in weekly review
- Minor drop-off (<20% below target): Monitor, report monthly
