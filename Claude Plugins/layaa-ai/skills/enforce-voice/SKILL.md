---
name: enforce-voice
description: >
  Apply brand voice guidelines to content. Review and rewrite content to match brand standards.
  In Layaa AI mode, enforces Layaa's tone (confident without arrogance, intelligent without jargon),
  vocabulary rules (banned: synergy/leverage/disrupt), and founder-specific voice profiles.
  Replaces generic brand-voice:enforce-voice and brand-voice:brand-voice-enforcement.
  Trigger: "enforce brand voice", "review voice", "check brand", "fix tone", "apply brand guidelines"
user-invocable: true
allowed-tools: Read, Grep, Glob
---

# Enforce Voice — Brand Voice Enforcement Skill

Apply brand voice guidelines to any piece of content. Review text for tone, vocabulary, structure, and channel fitness, then rewrite or annotate with specific fixes.

---

## Context Detection

- **Layaa AI mode** if: user mentions Layaa AI, a founder, brand voice, content for the company -> Read from shared-references/ and domain-references/brand-voice/
- **General mode** if: about another brand -> Operate as standard skill

## Reference Loading (Layaa AI Mode)

- shared-references/company-identity.md -- Company basics
- shared-references/icp-and-market.md -- Target audience
- domain-references/brand-voice/tone-framework.md -- Voice attributes, DO/DON'T, vocabulary
- domain-references/brand-voice/founder-voice.md -- Individual founder profiles
- domain-references/brand-voice/content-templates.md -- Format templates by channel

---

## Execution Steps

### Step 1: Receive and Parse the Content

- Accept the content to review. This may be provided inline, as a file path, or as a URL.
- If a file path is provided, use the Read tool to load the content.
- Identify the content type: LinkedIn post, email, website copy, proposal, pitch deck text, WhatsApp message, blog post, or other.
- Identify if the content is attributed to a specific founder (Abhimanyu Singh or Shubham Sharma).
- Note the intended audience if specified; otherwise infer from content and channel.

### Step 2: Determine Operating Mode

- Check whether the content is for Layaa AI or for another brand.
- **Layaa AI mode:** Load all reference files listed above using Read tool. These form the enforcement baseline.
- **General mode:** Ask the user for their brand guidelines, or work from any guidelines previously provided in the conversation. Apply standard brand voice enforcement principles without Layaa-specific rules.

### Step 3: Load the Tone Framework (Layaa AI Mode)

- Read `domain-references/brand-voice/tone-framework.md`.
- Extract the core voice attributes (e.g., confident without arrogance, intelligent without jargon, approachable but not casual, action-oriented).
- Extract the DO list (approved patterns, phrasings, structural choices).
- Extract the DON'T list (banned patterns, overused phrases, tone violations).
- Extract the banned vocabulary list. At minimum flag: "synergy", "leverage" (as verb meaning "use"), "disrupt", "revolutionize", "cutting-edge", "world-class", "game-changer", "next-gen", "seamless" (when used as filler).
- Extract preferred alternatives for each banned term.

### Step 4: Vocabulary Scan

- Scan the entire content for banned vocabulary terms.
- For each match found:
  - Record the exact term and its location (sentence or paragraph number).
  - Look up the preferred alternative from the tone framework.
  - If no direct alternative exists, propose a context-appropriate replacement.
- Also flag:
  - Excessive jargon that the target ICP would not immediately understand.
  - Buzzwords used without substantive meaning behind them.
  - Passive voice where active voice would be stronger and more on-brand.
  - Hedging language ("might", "could potentially", "we believe") where confident language is appropriate.

### Step 5: Tone Analysis

- Evaluate the overall tone against the brand voice attributes:
  - **Confidence check:** Does the content sound assured without crossing into arrogance or empty boasting?
  - **Intelligence check:** Does it demonstrate expertise without alienating non-technical readers?
  - **Approachability check:** Is it warm and human without being unprofessional or overly casual?
  - **Action orientation check:** Does it drive toward a clear next step or outcome?
- Score each attribute as: Aligned / Needs Adjustment / Misaligned.
- For any "Needs Adjustment" or "Misaligned" attribute, note the specific sentences or sections causing the issue.

### Step 6: Founder Voice Check (If Applicable)

- If the content is attributed to or ghostwritten for a specific founder:
  - Read `domain-references/brand-voice/founder-voice.md`.
  - Load that founder's specific voice profile (signature expressions, thought patterns, editing preferences).
  - Check whether the content sounds like it could authentically come from that founder.
  - Flag any phrases or structures that contradict the founder's established voice.
  - Suggest rewrites that incorporate the founder's signature expressions where natural.
- If not founder-attributed, skip this step.

### Step 7: Channel Format Compliance

- Read `domain-references/brand-voice/content-templates.md`.
- Match the content to its target channel (LinkedIn, email, website, proposal, etc.).
- Check against channel-specific rules:
  - **LinkedIn:** Hook in first line, appropriate length, hashtag usage, CTA style.
  - **Email:** Subject line strength, scanning structure, personalization, CTA placement.
  - **Website:** Heading hierarchy, scan-friendly formatting, SEO considerations.
  - **Proposal/Deck:** Professional structure, benefit-led framing, proof points.
- Flag any structural violations specific to the channel.

### Step 8: Audience Alignment Check

- Read `shared-references/icp-and-market.md`.
- Verify the content speaks to the identified target audience (SME founders, ops leads, CXOs).
- Check that pain points referenced are relevant to the ICP.
- Ensure the value proposition framing matches what resonates with the target segment.
- Flag any language that would alienate or confuse the intended audience.

### Step 9: Produce the Revised Content

- Rewrite the content incorporating all fixes identified in Steps 4-8.
- Preserve the original intent and key messages.
- Apply the tone framework attributes throughout.
- Use preferred vocabulary alternatives for all banned terms.
- If founder-voiced, weave in signature expressions naturally.
- Ensure channel formatting rules are met.
- Do not over-polish -- maintain a human, authentic feel.

### Step 10: Generate the Change Log

- Produce a structured change log with the following sections:

```
## Voice Enforcement Report

### Tone Alignment
| Attribute | Status | Notes |
|-----------|--------|-------|
| Confidence | Aligned/Adjusted/Misaligned | ... |
| Intelligence | ... | ... |
| Approachability | ... | ... |
| Action Orientation | ... | ... |

### Vocabulary Changes
| Original Term | Replacement | Reason |
|---------------|-------------|--------|
| ... | ... | Banned term / Jargon / Off-brand |

### Structural Changes
- [List of structural or formatting changes made]

### Founder Voice (if applicable)
- Alignment score: X/10
- Signature expressions added: [list]
- Patterns corrected: [list]

### Channel Compliance
- Channel: [identified channel]
- Format violations fixed: [list]
- Remaining recommendations: [list]
```

### Step 11: Quality Checklist

Before delivering the output, verify:

- [ ] All banned vocabulary removed or replaced
- [ ] Tone matches all four brand voice attributes
- [ ] If founder-voiced, content sounds authentically like that founder
- [ ] No unexplained jargon remains
- [ ] CTA is clear and actionable
- [ ] Channel formatting rules are met
- [ ] Content still conveys the original message and intent
- [ ] ICP alignment is maintained

---

## Output Format

Deliver two sections:

1. **Revised Content** -- The rewritten content, ready to use. Present it cleanly without markup or annotations.
2. **Change Log** -- The structured report from Step 10, so the user can see exactly what changed and why.

If the user asks for annotation only (no rewrite), deliver the Change Log with inline comments on the original text instead.

---

## Edge Cases

- **Multiple channels:** If the same content targets multiple channels, produce channel-specific variants.
- **Conflicting guidelines:** If tone framework rules conflict with founder voice preferences, founder voice takes precedence. Note the conflict in the change log.
- **Minimal changes needed:** If content is already well-aligned, say so explicitly. Do not make changes for the sake of change. Still produce the Change Log showing the review was thorough.
- **Non-English content:** Flag that brand voice guidelines are calibrated for English. Offer to review the translated version against tone principles but note that vocabulary rules may not directly apply.
- **No guidelines available (General mode):** Ask the user to provide brand guidelines, or extract voice patterns from sample content they provide. Do not invent guidelines.
