---
name: brand-review
description: >
  Audit marketing materials, content, or campaigns for brand consistency. Checks tone, messaging,
  visual identity guidelines compliance, and alignment with brand positioning. Provides specific
  improvement recommendations. In Layaa AI mode, scores against brand voice framework and vocabulary
  rules. Trigger: "brand review", "brand audit", "brand consistency check", "voice review",
  "tone check", "brand compliance". This skill replaces the generic marketing:brand-review capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Brand Review

Audit marketing materials, content, or campaigns for brand consistency, checking tone, messaging, visual identity guidelines compliance, and alignment with brand positioning.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- domain-references/brand-voice/tone-framework.md — Brand voice, tone attributes, DO/DON'T rules, vocabulary guidance
- domain-references/brand-voice/founder-voice.md — Founder voice profiles (for founder-attributed content)
- domain-references/brand-voice/content-templates.md — Content format templates by channel
- domain-references/marketing/gtm-strategy.md — GTM strategy and positioning statement
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Receive Content for Review
Gather the material(s) to audit:
- Ask the user to provide the content (paste text, share file path, or provide URL)
- Identify the content type: blog post, social media post, email, website copy, pitch deck, one-pager, ad copy
- Identify the intended channel and target audience
- Note if this is founder-attributed content (requires founder voice profile check)
- Confirm what level of review is needed: quick check, full audit, or detailed rewrite recommendations

### Step 2: Load Brand Voice Framework (Layaa AI Mode)
For Layaa AI mode, read the brand voice framework:
- **Core voice attributes:** Confident not arrogant, warm not casual, clear not oversimplified
- **Tone spectrum:** Where the content should fall on formality, technicality, and energy scales
- **DO rules:** Sound knowledgeable, practical, approachable, solution-oriented
- **DON'T rules:** Sound salesy, hyperbolic, jargon-heavy, condescending, desperate
- **Vocabulary guidance:**
  - Preferred terms (approved vocabulary)
  - Banned terms: "revolutionary", "game-changing", "disruptive", "cutting-edge", "synergy", "leverage" (verb), "circle back"
  - Cautious terms (use sparingly with context)
- **Indian English:** "modernise" not "modernize", "organisation" not "organization"

### Step 3: Assess Tone Alignment
Evaluate the content's tone against brand attributes:
- **Confidence level:** Does it sound confident without being arrogant? Flag any language that sounds boastful or uncertain
- **Warmth level:** Does it sound approachable without being too casual? Flag overly formal or overly informal language
- **Clarity level:** Is it clear without being oversimplified? Flag jargon or vague language
- **Expertise signal:** Does it demonstrate knowledge without lecturing? Flag condescending or superficial passages
- Score each dimension: Aligned / Slightly Off / Misaligned

### Step 4: Check Vocabulary Compliance
Scan the content for vocabulary issues:
- **Banned terms found:** List any banned terms with their location in the content
- **Suggested replacements:** Provide approved alternatives for each banned term
- **Jargon check:** Flag technical terms that may not be understood by the target audience
- **Buzzword check:** Flag marketing buzzwords that weaken credibility
- **Indian English check:** Flag American English spellings or phrasing

### Step 5: Verify Messaging Alignment
Check that the content aligns with brand positioning:
- Does it reflect Layaa AI's positioning? ("AI automation and enablement for Indian SMEs")
- Does it communicate the right value proposition for the target audience?
- Are claims defensible and not overpromising?
- Does it reference the methodology appropriately (if relevant)?
- Does it align with the current GTM strategy and messaging priorities?

### Step 6: Check Format Compliance
Verify the content follows the appropriate template for its channel:
- **Blog:** Subheadings every 200-300 words? Scannable structure? Clear CTA?
- **LinkedIn:** Short paragraphs? Line breaks for readability? Appropriate length?
- **Email:** Mobile-friendly length? Single focus? Clear CTA?
- **Website:** Clear hierarchy? Value-first structure? Prominent CTA?
- **Ad copy:** Character limits met? Clear value prop? Strong CTA?
- Flag format issues and suggest corrections

### Step 7: Founder Voice Check (if applicable)
If the content is attributed to a specific founder:
- Load the individual founder voice profile from `domain-references/brand-voice/founder-voice.md`
- Compare the content's voice against the founder's specific patterns, preferences, and communication style
- Flag passages that do not sound like the attributed founder
- Suggest revisions to better match the founder's voice

### Step 8: Score and Summarize
Provide an overall brand compliance assessment:
- Score each dimension on a scale (Fully Compliant / Mostly Compliant / Needs Revision / Non-Compliant)
- Calculate an overall compliance score
- Prioritize issues by severity (critical / important / minor)
- Provide specific, actionable revision recommendations for each issue found

### Step 9: Provide Improvement Recommendations
For each issue identified:
- Quote the specific problematic text
- Explain why it is a brand compliance issue
- Provide a revised version that addresses the issue
- Note the priority level of the fix

## Output Format

```
# Brand Review Report
**Content:** [title or description of content reviewed]
**Type:** [blog/social/email/website/etc.]
**Channel:** [where it will be published]
**Reviewer:** Brand Voice Audit
**Date:** [date]

## Overall Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Tone Alignment | [Fully/Mostly/Needs Revision/Non-Compliant] | [brief note] |
| Vocabulary Compliance | [Fully/Mostly/Needs Revision/Non-Compliant] | [brief note] |
| Messaging Alignment | [Fully/Mostly/Needs Revision/Non-Compliant] | [brief note] |
| Format Compliance | [Fully/Mostly/Needs Revision/Non-Compliant] | [brief note] |
| Founder Voice Match | [Fully/Mostly/Needs Revision/N/A] | [brief note] |
| **Overall** | **[score]** | **[summary]** |

## Critical Issues (Must Fix)
1. **[Issue]**
   - Found: "[quoted text]"
   - Problem: [explanation]
   - Suggested revision: "[revised text]"

## Important Issues (Should Fix)
1. **[Issue]**
   - Found: "[quoted text]"
   - Problem: [explanation]
   - Suggested revision: "[revised text]"

## Minor Issues (Nice to Fix)
1. **[Issue]**
   - Found: "[quoted text]"
   - Problem: [explanation]
   - Suggested revision: "[revised text]"

## Banned Terms Found
| Term | Location | Suggested Replacement |
|------|----------|-----------------------|
| [term] | [where in content] | [replacement] |

## What Works Well
- [Positive element 1]
- [Positive element 2]
- [Positive element 3]

## Summary
[2-3 sentence summary of overall brand compliance and priority actions]
```

## What Makes This Different from Generic Brand Reviews
- Scores against Layaa AI's specific brand voice framework with defined DO/DON'T rules
- Checks vocabulary against a defined list of banned, preferred, and cautious terms
- Verifies Indian English conventions (not American English)
- Includes founder voice profile matching for founder-attributed content
- Validates messaging alignment with Layaa AI's GTM positioning and methodology
- Checks format compliance against Layaa AI's channel-specific content templates
- Produces actionable revision suggestions that maintain Layaa AI's voice while fixing issues
