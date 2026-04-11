---
name: email-sequence
description: >
  Design and write multi-step email sequences for nurture campaigns, onboarding, re-engagement,
  or sales follow-up. Includes subject lines, body copy, timing, and segmentation strategy.
  In Layaa AI mode, applies brand voice and ICP-specific messaging. Trigger: "email sequence",
  "nurture campaign", "drip campaign", "email flow", "onboarding emails", "follow-up sequence".
  This skill replaces the generic marketing:email-sequence capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Email Sequence

Design and write multi-step email sequences for nurture campaigns, onboarding, re-engagement, or sales follow-up with subject lines, body copy, timing, and segmentation strategy.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/service-verticals.md — Services and methodology
- domain-references/brand-voice/tone-framework.md — Brand voice and tone rules
- domain-references/brand-voice/content-templates.md — Content format templates
- domain-references/marketing/target-segments.md — Target segment details and personas
- domain-references/marketing/campaign-execution.md — Campaign execution framework and UTM standards
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Define Sequence Objective
Identify the type of email sequence needed:
- **Nurture:** Move leads from awareness to consideration (MQL warming)
- **Onboarding:** Welcome new clients and set expectations
- **Re-engagement:** Reactivate cold or dormant leads
- **Sales follow-up:** Support the sales process after initial contact
- Confirm objective, expected outcome, and success metric with the user

### Step 2: Identify Target Segment and Funnel Stage
Determine who receives the sequence:
- Which persona/ICP segment is being targeted
- What funnel stage they are currently at (awareness/consideration/decision)
- What action or trigger initiates the sequence (form fill, demo request, inactivity, contract sign)
- Any segmentation variables (industry, company size, engagement level)

### Step 3: Load Brand Voice and Templates (Layaa AI Mode)
For Layaa AI mode:
- Read brand voice framework from `domain-references/brand-voice/tone-framework.md`
- Read content templates from `domain-references/brand-voice/content-templates.md`
- Match the sequence tone to the ICP persona (technical for CTOs, strategic for founders, operational for COOs)
- Apply tone rules: confident not arrogant, warm not casual, clear not oversimplified
- Note banned terms: "revolutionary", "game-changing", "disruptive", "cutting-edge", "synergy", "leverage" (verb)

### Step 4: Design Sequence Structure
Design the email flow based on the objective:

**Nurture sequence (5-7 emails):**
1. Welcome — introduce value proposition, set expectations
2. Value — educational content addressing primary pain point
3. Case Study — social proof relevant to their industry
4. Deeper Value — second pain point or use case
5. Offer — specific CTA (demo, consultation, assessment)
6. Follow-up — address common objections
7. Soft close — final value reminder with easy CTA

**Onboarding sequence (4-5 emails):**
1. Welcome — congratulations, what to expect, key contacts
2. Getting Started — first steps, timeline, access setup
3. Milestone — check-in at first week, quick win highlight
4. Deep Dive — feature or service spotlight
5. Feedback — satisfaction check, support reminder

**Re-engagement sequence (3-4 emails):**
1. We noticed — acknowledge absence, offer value
2. What's new — highlight recent updates or content
3. Specific offer — incentive or exclusive content
4. Breakup — respectful final email

**Sales follow-up sequence (3-4 emails):**
1. Thank you — recap conversation, next steps
2. Value add — relevant resource or insight
3. Social proof — case study or testimonial
4. Gentle close — restate value, easy CTA

### Step 5: Write Each Email
For each email in the sequence, write:
- **Subject line:** 6-8 words, specific and relevant, no clickbait or ALL CAPS
- **Preview text:** 40-90 characters supporting the subject line
- **Body copy:** 100-200 words, scannable, single focus per email
- **CTA:** One clear call-to-action per email, appropriate to funnel stage
  - Awareness stage: soft/educational (read, learn, explore)
  - Consideration stage: engagement (watch demo, download guide, book assessment)
  - Decision stage: action (schedule call, start project, sign up)
- **Sender:** Specify recommended sender (founder name, team, company)
- **P.S. line:** Optional — use for secondary CTA or personal touch

### Step 6: Add Timing Recommendations
Specify timing between each email:
- Nurture: 2-3 days between early emails, 4-5 days for later emails
- Onboarding: Day 0, Day 1, Day 3, Day 7, Day 14
- Re-engagement: Day 0, Day 3, Day 7, Day 14 (breakup)
- Sales follow-up: Day 0, Day 2, Day 5, Day 10
- Note optimal send times (Layaa AI: Tuesday-Thursday, 10am-12pm IST for B2B)
- Include exit conditions (what triggers removal from sequence)

### Step 7: Include Segmentation and Personalization Tags
Add personalization elements:
- `{{first_name}}`, `{{company_name}}`, `{{industry}}`
- Dynamic content blocks based on segment (ICP-specific pain points)
- Conditional logic notes (if [segment], show [content variant])
- Specify which fields must be populated for the sequence to work

### Step 8: Add UTM Tracking (Layaa AI Mode)
For Layaa AI mode, apply standard UTM format from campaign-execution.md:
- `utm_source=email`
- `utm_medium=nurture` (or `onboarding`, `reengagement`, `followup`)
- `utm_campaign=[sequence-name]`
- `utm_content=[email-number]-[cta-description]`
- Apply UTM parameters to all links in each email

## Output Format

```
# Email Sequence: [Sequence Name]
**Objective:** [nurture/onboarding/re-engagement/sales follow-up]
**Target Segment:** [persona/ICP]
**Funnel Stage:** [awareness/consideration/decision]
**Trigger:** [what initiates the sequence]
**Total Emails:** [count]
**Duration:** [total days from first to last email]

## Sequence Overview

| # | Email Name | Timing | Subject Line | CTA Type |
|---|-----------|--------|--------------|----------|
| 1 | [name] | Day 0 | [subject] | [soft/engagement/action] |
| 2 | [name] | Day 3 | [subject] | [soft/engagement/action] |
| ... | ... | ... | ... | ... |

## Email Details

### Email 1: [Name]
**Send:** [timing/trigger]
**From:** [sender]
**Subject:** [subject line]
**Preview:** [preview text]

[Body copy with personalization tags]

**CTA:** [call to action]
**UTM:** [tracking parameters]

---

[Repeat for each email]

## Segmentation Notes
- [Segment-specific variations]
- [Conditional logic rules]
- [Required personalization fields]

## Exit Conditions
- [When to remove contacts from this sequence]
- [Trigger for moving to next sequence]

## Success Metrics
- Open rate target: [%]
- Click rate target: [%]
- Conversion target: [%]
- Unsubscribe threshold: [%]
```

## What Makes This Different from Generic Email Sequences
- Applies Layaa AI brand voice rules (tone, vocabulary, banned terms) to all email copy
- Matches messaging to specific ICP personas with tailored pain points and value propositions
- Uses Layaa AI's standard UTM tracking format for consistent attribution
- References Layaa AI's funnel stages and conversion benchmarks for realistic targeting
- Incorporates Layaa AI's content templates for consistent formatting across sequences
- Timing recommendations aligned with B2B email best practices for Indian SME audience
