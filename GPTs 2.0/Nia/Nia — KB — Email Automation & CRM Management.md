# Nia — Email Automation & CRM Management

**Owner:** Nia (Campaign & Funnel Execution Coordinator)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — SOP updates follow institutional memory process

---

## Email Deliverability Checklist

- [ ] Sender domain authenticated (SPF, DKIM, DMARC)
- [ ] Sending from consistent "from" address
- [ ] Subject line <60 characters, no spam trigger words
- [ ] Unsubscribe link present and functional
- [ ] Physical address included (CAN-SPAM / Indian IT Act compliance)
- [ ] Images have alt text
- [ ] Plain text version included
- [ ] List hygiene maintained (remove bounces, unsubscribes)

---

## Email Timing Guide (India B2B)

- **Best days:** Tuesday, Wednesday, Thursday
- **Best time:** 10:00-11:00 AM IST
- **Avoid:** Monday morning (inbox overload), Friday afternoon (low engagement), weekends
- **Maximum frequency:** 2 emails per week to any individual contact
- **Minimum gap between sequences:** 48 hours

---

## Email Personalization Hierarchy

1. Name and company (basic — always do this)
2. Industry-specific content (if segment data available)
3. Behavior-based triggers (if engagement tracking available)
4. Role-specific messaging (if title data available)

---

## A/B Testing Protocol for Emails

- Test one variable at a time (subject line OR send time OR CTA — never multiple)
- Split: 50/50 for small lists, 20/20/60 for larger lists (20% each variant, 60% gets winner)
- Minimum sample: 100 recipients per variant
- Wait for 24 hours before declaring winner (for open rate tests)
- Wait for 48 hours before declaring winner (for click/conversion tests)
- Document every test result in memory

---

## CRM Funnel Management Guide

### Pipeline Configuration

**Pipeline Stages:**
```
1. New Lead (Unqualified)
   └── Source, contact info, initial engagement data
2. MQL (Marketing Qualified Lead)
   └── Meets scoring threshold, behavioral signals present
3. SQL (Sales Qualified Lead)
   └── Confirmed fit, discovery call scheduled or completed
4. Proposal Sent
   └── Formal proposal delivered, follow-up sequence active
5. Negotiation
   └── Active discussion on terms, pricing, scope
6. Won
   └── Contract signed, payment initiated
7. Lost
   └── Tagged with loss reason, moved to re-engagement nurture
```

### Lead Scoring Model

| Criterion | Points | Maximum |
|-----------|--------|---------|
| **Firmographic Fit** | | |
| Company size matches ICP (5-200 employees) | +20 | 20 |
| Industry matches target vertical | +15 | 15 |
| Location in target geography (NCR/Tier 1) | +10 | 10 |
| Revenue in target range | +10 | 10 |
| **Behavioral Signals** | | |
| Downloaded lead magnet | +15 | 15 |
| Attended webinar/workshop | +20 | 20 |
| Visited pricing page | +15 | 15 |
| Requested demo/consultation | +25 | 25 |
| Opened 3+ emails | +10 | 10 |
| **Engagement Recency** | | |
| Engaged in last 7 days | +10 | 10 |
| Engaged in last 30 days | +5 | 5 |

**MQL Threshold:** 50 points
**SQL Threshold:** 75 points (plus human/founder confirmation)

### CRM Hygiene Rules

- Monthly data quality review
- Remove duplicates weekly
- Update lead status within 24 hours of stage change
- Tag all leads with source campaign and UTM data
- Archive lost leads after 90 days of no engagement (do not delete)
- Flag leads stagnant in any stage for 30+ days

---

*This knowledge base is Nia's operational reference for email automation and CRM funnel management at Layaa AI. Every email sequence and CRM operation should follow these standards. The document evolves as execution experience accumulates and processes improve.*
