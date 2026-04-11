---
name: layaa-brand
description: >
  Layaa AI Brand Voice skill group. Use for: enforcing brand voice on content,
  generating brand guidelines from source materials, and discovering/auditing
  brand assets for consistency. Applies Layaa AI's tone framework and individual
  founder voice profiles. Works for Layaa AI and general brand tasks.
user-invocable: true
---

# Layaa Brand — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **enforce-voice** | Apply brand voice to content — review and rewrite for brand consistency |
| **generate-guidelines** | Generate brand guidelines from documents, transcripts, or descriptions |
| **discover-brand** | Audit brand materials across sources, find inconsistencies |

## How to Use
- "Rewrite this LinkedIn post in our brand voice" → **enforce-voice**
- "Create a brand guide from our existing content" → **generate-guidelines**
- "Check if our website and sales deck are consistent" → **discover-brand**

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, founders, or Layaa content → apply Layaa AI brand framework from Project Knowledge
- **General mode:** Different company → standard brand voice assistant

---

## Layaa AI Brand Context (Quick Reference)

**5 Core Voice Attributes:** Confident without arrogance | Practical over theoretical | Locally intelligent (Indian context) | Expert but accessible | Results-oriented

**DO:** Indian business context | Specific ₹ numbers | Lead with client outcome | Active voice | "we" for company
**DON'T:** AI hype words (revolutionary/game-changing) | Passive voice | "We are Layaa AI" openers | Dollar signs | Over-explain technically

**Banned:** "Revolutionary AI" | "Game-changing" | "End-to-end ecosystem" | "We're excited to announce" | "Best-in-class"

**Approved signature phrases:** "AI that actually works for Indian businesses" | "Scale without hiring" | "Your automation team, not just a tool"

**Founder voices:**
- Abhimanyu Singh: Visionary, business-first, narrative-led, Indian analogies. Topics: AI adoption barriers, SME opportunity, strategy.
- Shubham Sharma: Technical but accessible, step-by-step, before/after comparisons. Topics: Automation architecture, build stories, no-code tools.

---

## Sub-Skill Execution

### enforce-voice
1. Receive content to review (paste or describe)
2. Check against 5 voice attributes, DO/DON'T list, vocabulary guidance from Project Knowledge
3. Score: Voice alignment (1-10), list specific issues found
4. Rewrite the content applying all corrections
5. Highlight what changed and why
6. For founder content: confirm which founder, apply their specific voice profile

### generate-guidelines
1. Ask for source materials: existing content, transcripts, documents, or descriptions
2. Extract: tone patterns, vocabulary preferences, messaging themes, audience signals
3. Structure guidelines: Voice attributes → Tone by channel → DO/DON'T → Vocabulary guide → Examples
4. For Layaa AI: merge with existing framework, flag any conflicts
5. Output as formatted brand guidelines document

### discover-brand
1. Ask for materials to audit: URLs, documents, content samples
2. Review each for: voice consistency, messaging alignment, coherence across touchpoints
3. Flag inconsistencies: where does the brand sound different?
4. Score each material against the brand framework (1-10)
5. Recommend: what to update, what's working, priority order for fixes
