# Nia — UTM & Tracking Standards

**Owner:** Nia (Campaign & Funnel Execution Coordinator)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — SOP updates follow institutional memory process

---

## UTM Parameter Definitions

| Parameter | Format | Examples |
|-----------|--------|---------|
| `utm_source` | Platform name, lowercase | linkedin, google, meta, email, whatsapp, referral |
| `utm_medium` | Traffic type, lowercase | cpc, organic, email, social, referral, display |
| `utm_campaign` | Campaign name, lowercase, hyphens | school-outreach-q2, ca-firm-awareness, eduflow-launch |
| `utm_content` | Content variant identifier | variant-a, variant-b, long-form, short-form |
| `utm_term` | Keyword (search campaigns only) | ai-automation-india, school-management-software |

---

## UTM Naming Convention Rules

- All lowercase, no spaces
- Use hyphens (-) as separators
- Be descriptive but concise
- Include campaign identifier that maps to campaign brief
- Include variant identifier for A/B tests

---

## UTM Template for Common Channels

**LinkedIn Organic Post:**
`?utm_source=linkedin&utm_medium=organic&utm_campaign=[campaign-name]&utm_content=[post-type]`

**LinkedIn Paid Ad:**
`?utm_source=linkedin&utm_medium=cpc&utm_campaign=[campaign-name]&utm_content=[ad-variant]`

**Google Search Ad:**
`?utm_source=google&utm_medium=cpc&utm_campaign=[campaign-name]&utm_term=[keyword]`

**Email Campaign:**
`?utm_source=email&utm_medium=email&utm_campaign=[campaign-name]&utm_content=[email-number]`

**WhatsApp Outreach:**
`?utm_source=whatsapp&utm_medium=referral&utm_campaign=[campaign-name]`

---

## Campaign Tracking Checklist

### Pre-Campaign Tracking Setup

- [ ] Google Analytics configured on all destination pages
- [ ] Conversion goals/events defined and tested
- [ ] UTM parameters created for all campaign links
- [ ] UTM tracking sheet updated with new campaign parameters
- [ ] Landing page form submissions tracking confirmed
- [ ] Email platform tracking (opens, clicks, conversions) confirmed
- [ ] CRM integration tested (leads flowing correctly)
- [ ] Ad platform conversion pixels installed (if paid campaign)
- [ ] Retargeting audiences defined and pixel firing
- [ ] Reporting template prepared with all required metrics

### Mid-Campaign Tracking Verification
- [ ] UTMs appearing correctly in analytics
- [ ] Conversion events firing correctly
- [ ] Lead data flowing to CRM with correct attribution
- [ ] No broken links or tracking gaps
- [ ] Spend pacing aligned with budget

### Post-Campaign Data Collection
- [ ] Final performance metrics extracted
- [ ] Attribution data compiled
- [ ] Cost per lead / CAC calculated
- [ ] ROI calculated (if sufficient data)
- [ ] Comparison against benchmarks documented
- [ ] Learnings documented in execution memory
- [ ] Data shared with Zoya (for analysis) and Rishi (for revenue tracking)
