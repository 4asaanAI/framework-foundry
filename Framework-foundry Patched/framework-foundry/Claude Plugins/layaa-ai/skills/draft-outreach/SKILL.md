---
name: draft-outreach
description: >
  Research a prospect then draft personalized outreach. In Layaa AI mode, uses ICP profiles,
  battle cards, and persona-specific messaging. Replaces generic sales:draft-outreach.
  Trigger: "draft outreach", "write cold email", "prospecting email", "outreach sequence"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Draft Outreach

Generate personalized, high-conversion outreach emails by combining prospect research with battle-card messaging and brand voice compliance.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/sales/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/revenue-model.md — Pricing and conversion funnel
- shared-references/service-verticals.md — Services and methodology
- domain-references/sales/sales-playbook.md — Battle cards and objection handling
- domain-references/sales/service-config-matrix.md — Package tiers
- domain-references/sales/pricing-quick-ref.md — Pricing tables
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify the Prospect
Gather or ask for the following:
- **Company name** and website URL
- **Contact person** name and role/title
- **Industry vertical** (if known)
- **Any known context** (referral, event, inbound signal)

If incomplete, ask the user for missing details before proceeding.

### Step 2: Research the Prospect
Using WebSearch and WebFetch:
1. Visit the company website — extract what the company does, size indicators, tech stack signals, recent news
2. Check the contact's LinkedIn profile or public presence — role tenure, recent posts, stated priorities
3. Look for company pain signals: job postings (hiring ops/tech roles = scaling pain), press releases, funding rounds, regulatory changes in their sector
4. Note any existing automation or AI mentions on their site

Compile a **Research Brief** with:
- Company summary (1-2 sentences)
- Industry vertical classification
- Estimated employee count / stage
- Key pain indicators found
- Contact's likely priorities based on role

### Step 3: Match to ICP and Persona (Layaa AI Mode)
Read `shared-references/icp-and-market.md` and match the prospect:

| ICP | Match Signals |
|-----|---------------|
| SaaS Startups (5-25 employees, post-seed) | Tech company, small team, scaling challenges, manual ops |
| Logistics & Supply Chain SMEs (50-200 employees) | Warehousing, fleet, distribution, manual tracking |
| Fintech & Payment Processors (10-100 employees) | Financial services, compliance burden, fraud concerns |
| Professional Services (10-50 employees) | HR/Legal/Consulting firm, admin overhead, client communication |

If the prospect does not fit any ICP, note this and proceed with general messaging.

### Step 4: Select Messaging Angle
From `domain-references/sales/sales-playbook.md`, load the battle card for the matched ICP:
- Identify the **primary pain point** to lead with
- Select the **value proposition** most relevant to their role
- Choose **proof points** (metrics, outcomes) appropriate for their industry
- Identify the **risk of inaction** angle to create urgency

**Persona-specific adjustments:**
- **Founder/CEO:** Lead with strategic impact, ROI, competitive advantage. Keep it concise.
- **Operations/COO:** Lead with time saved, error reduction, process visibility. Be specific.
- **Tech Lead/CTO:** Lead with integration ease, no vendor lock-in, n8n/API compatibility. Be technical.
- **Finance/CFO:** Lead with cost savings, unit economics improvement, measurable outcomes.

### Step 5: Draft the Email
Follow this structure:

**Subject Line (6-8 words):**
- Must be specific to their situation, not generic
- Reference their industry, a pain point, or a trigger event
- No clickbait, no ALL CAPS, no exclamation marks
- Examples: "Automating [process] for [industry] teams", "Reducing [pain] at [company]"

**Opening Hook (1-2 sentences):**
- Reference something specific: a trigger event, a public pain signal, or a shared context
- Never start with "I" or with a compliment about their company
- Show you understand their world before pitching

**Value Proposition (2-3 sentences):**
- State what Layaa AI does in the context of THEIR problem
- Use one specific metric or outcome
- Mention the methodology only if relevant (Discovery → Assessment → Development → Validation → Enablement)

**Social Proof / Credibility (1 sentence, optional):**
- Reference similar companies helped, or a relevant capability
- Do not fabricate case studies — use only approved references from the playbook

**CTA (1 sentence):**
- Single, clear ask — typically a 15-20 minute call
- Make it low-commitment: "Would a 15-minute call this week make sense?"
- Never use aggressive CTAs like "Let's get started" or "Sign up now"

**Signature:**
- Use the sender's name as provided, or default to founder name if specified

### Step 6: Brand Voice Compliance (Layaa AI Mode)
Review the draft against these rules:
- **Tone:** Confident, clear, helpful — never salesy, never desperate
- **Approved phrases:** "AI automation and enablement", "modernise operations", "practical AI adoption"
- **Banned terms:** "revolutionary", "game-changing", "disruptive", "cutting-edge", "synergy", "leverage" (as a verb), "circle back"
- **No jargon:** Avoid technical terms unless writing to a CTO
- **No hype:** Every claim must be defensible. No "10x your revenue" style promises
- **Indian English:** Use "modernise" not "modernize", "organisation" not "organization"

### Step 7: Generate Variants (if requested)
If the user asks for a sequence or variants:
- **Variant A:** Pain-point-first approach (lead with their problem)
- **Variant B:** Insight-first approach (lead with an industry trend or observation)
- **Variant C:** Referral/mutual connection approach (if applicable)

For multi-touch sequences:
- Email 1: Value-first introduction (Day 0)
- Email 2: Specific use case or insight (Day 3)
- Email 3: Social proof or case reference (Day 7)
- Email 4: Breakup email — respectful close (Day 14)

## Output Format

```
## Prospect Research Brief
- **Company:** [Name] | [Industry] | [Size estimate]
- **Contact:** [Name] | [Title]
- **ICP Match:** [ICP category] | Confidence: [High/Medium/Low]
- **Key Pain Signals:** [bullet list]
- **Trigger Event:** [if found]

## Outreach Email

**Subject:** [subject line]

[email body]

[signature]

## Notes
- **Messaging angle used:** [which battle card / pain point]
- **Follow-up timing:** [recommended next touch]
- **Objection to prepare for:** [likely pushback based on persona]
```

## What Makes This Different from Generic Outreach
- Matches prospects to Layaa AI's specific ICP profiles with defined pain points and budgets
- Uses battle-card messaging from the sales playbook rather than generic templates
- Enforces Layaa AI brand voice rules (no jargon, no hype, Indian English)
- References actual service packages and pricing tiers when appropriate
- Builds outreach around the Discovery → Assessment → Development → Validation → Enablement methodology
- Knows which pain points map to which service verticals and can recommend specific packages
