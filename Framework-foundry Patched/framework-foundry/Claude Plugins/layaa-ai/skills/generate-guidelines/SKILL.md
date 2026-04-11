---
name: generate-guidelines
description: >
  Generate brand voice guidelines from documents, transcripts, or examples.
  In Layaa AI mode, starts from existing Layaa AI tone framework and extends/refines it.
  Replaces generic brand-voice:generate-guidelines and brand-voice:guideline-generation.
  Trigger: "generate brand guidelines", "create voice guide", "brand guidelines", "style guide"
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# Generate Guidelines -- Brand Voice Guideline Generation Skill

Generate comprehensive brand voice guidelines from source materials. Analyze documents, transcripts, content samples, and existing frameworks to produce a structured voice guide. In Layaa AI mode, build on the existing tone framework rather than starting from scratch.

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

### Step 1: Understand the Request Scope

- Clarify what the user needs:
  - **Full guidelines from scratch** (new brand or brand with no existing guide).
  - **Extend existing guidelines** (add new channels, audiences, or content types).
  - **Refine existing guidelines** (sharpen rules based on new examples or feedback).
  - **Audit and update** (check if current guidelines still match actual brand output).
- Identify the source materials available:
  - Existing brand documents, pitch decks, website copy.
  - Founder transcripts, interviews, social media posts.
  - Sample content the brand considers "on-brand".
  - Sample content the brand considers "off-brand" (counter-examples).
  - Competitor content for differentiation reference.

### Step 2: Determine Operating Mode and Load Foundation

- **Layaa AI mode:**
  - Read `domain-references/brand-voice/tone-framework.md` as the existing foundation.
  - Read `domain-references/brand-voice/founder-voice.md` for established founder profiles.
  - Read `domain-references/brand-voice/content-templates.md` for existing channel rules.
  - Read `shared-references/company-identity.md` for company positioning context.
  - Read `shared-references/icp-and-market.md` for audience context.
  - The goal is to EXTEND or REFINE, not replace. Any new guidelines must be compatible with the existing framework.
- **General mode:**
  - No pre-existing framework to load.
  - Build guidelines entirely from the source materials provided.
  - If no source materials are provided, ask the user for at least 3-5 samples of content they consider on-brand.

### Step 3: Analyze Source Materials

- Read all provided source materials using the Read tool.
- For each source, extract and catalog:
  - **Tone markers:** Formal vs. casual, technical vs. accessible, assertive vs. tentative.
  - **Sentence structure patterns:** Average sentence length, use of fragments, paragraph density.
  - **Vocabulary fingerprint:** Recurring terms, industry-specific language, colloquialisms.
  - **Rhetorical patterns:** How arguments are structured, how value is communicated.
  - **Emotional register:** What emotions the content evokes -- urgency, trust, excitement, calm authority.
  - **Point of view:** First person ("we"), second person ("you"), third person, or mixed.
  - **CTA patterns:** How calls to action are framed and positioned.
- If counter-examples (off-brand content) are provided, note what makes them off-brand as negative constraints.

### Step 4: Identify Voice Patterns

- From the analysis in Step 3, synthesize the core voice patterns:
  - **Primary voice attributes** (3-5 adjectives that define the brand voice, each with a qualifier to prevent misinterpretation -- e.g., "Confident, not arrogant").
  - **Voice spectrum:** Where the brand sits on key spectrums:
    - Formal <-----> Casual
    - Technical <-----> Accessible
    - Assertive <-----> Supportive
    - Serious <-----> Playful
    - Innovative <-----> Established
  - **Signature patterns:** Unique phrasings, structural choices, or rhetorical devices the brand uses consistently.
  - **Anti-patterns:** Phrasings, tones, or structures the brand consistently avoids.

### Step 5: Cross-Reference with Existing Framework (Layaa AI Mode)

- Compare the patterns extracted in Step 4 against the existing tone framework.
- Categorize findings:
  - **Reinforcements:** Patterns that confirm and strengthen existing guidelines.
  - **Extensions:** New patterns not covered by existing guidelines -- candidates for addition.
  - **Conflicts:** Patterns that contradict existing guidelines -- require founder review.
  - **Gaps:** Areas where existing guidelines are silent and new materials suggest a rule is needed.
- For each conflict, document:
  - What the existing guideline says.
  - What the new source material suggests.
  - A recommendation for resolution.
  - A flag that this needs founder decision.

### Step 6: Build the Vocabulary Framework

- Compile the vocabulary rules:
  - **Preferred terms:** Words and phrases the brand actively uses and should continue using.
  - **Banned terms:** Words and phrases that are off-brand, with explanations of why.
  - **Contextual terms:** Words that are acceptable in some contexts but not others (with usage rules).
  - **Replacement mappings:** For each banned term, provide 2-3 preferred alternatives.
- In Layaa AI mode: Start from the existing banned list (synergy, leverage, disrupt, etc.) and add any new terms identified from the source analysis. Never remove existing banned terms without flagging for founder review.
- In General mode: Build the vocabulary framework entirely from the source analysis and any explicit user input.

### Step 7: Define Channel Adaptations

- For each relevant channel (LinkedIn, email, website, proposals, WhatsApp, blog, presentations):
  - **Tone adjustment:** How the core voice adapts for this channel (e.g., LinkedIn may be slightly more personal than website copy).
  - **Length guidelines:** Word count ranges, paragraph limits, section counts.
  - **Structural rules:** Opening hooks, CTA placement, formatting conventions.
  - **Audience context:** Who primarily reads this channel and how that affects voice.
  - **Examples:** One "ideal" example per channel if source materials allow.
- In Layaa AI mode: Load existing channel templates and extend rather than replace.

### Step 8: Create Founder Voice Profiles (If Applicable)

- If the brand has identifiable individual voices (founders, executives, spokespersons):
  - For each person, document:
    - **Background and perspective:** What shapes their worldview and communication style.
    - **Signature expressions:** Phrases or constructions they consistently use.
    - **Thought patterns:** How they structure arguments and present ideas.
    - **Editing patterns:** What they typically change when reviewing content.
    - **Topics of passion:** Subjects where their voice becomes most distinctive.
    - **Boundaries:** Topics they avoid or handle differently.
  - Include guidance for ghostwriting: how to write as this person convincingly.
- In Layaa AI mode: Cross-reference with existing founder profiles. Add new observations, flag any shifts in voice, but do not overwrite established profiles without flagging.

### Step 9: Compile the Guidelines Document

- Structure the final guidelines document with the following sections:

```
# [Brand Name] -- Brand Voice Guidelines

## 1. Brand Identity Summary
- Who we are (one paragraph)
- Who we serve (ICP summary)
- How we want to be perceived

## 2. Core Voice Attributes
- [Attribute 1]: [Definition + qualifier]
- [Attribute 2]: [Definition + qualifier]
- [Attribute 3]: [Definition + qualifier]
- [Attribute 4]: [Definition + qualifier]
- Voice spectrum positioning (visual or table)

## 3. Tone DO and DON'T
### DO:
- [Rule with example]
### DON'T:
- [Rule with counter-example]

## 4. Vocabulary Rules
### Preferred Terms
| Term | Usage Context | Example |
### Banned Terms
| Term | Why Banned | Preferred Alternative |
### Contextual Terms
| Term | Acceptable When | Avoid When |

## 5. Channel Guidelines
### [Channel 1]
- Tone adaptation
- Length and structure
- Example
### [Channel 2]
- ...

## 6. Individual Voice Profiles (if applicable)
### [Person 1]
- Signature expressions
- Writing patterns
- Ghostwriting guidance

## 7. Quality Checklist
- [ ] Pre-publish review checklist items

## 8. Revision History
- Date, change, reason
```

### Step 10: Conflict Report (Layaa AI Mode)

- If operating in Layaa AI mode, append a separate conflict report:

```
## Conflict Report -- Founder Review Required

### New Additions (Compatible)
- [List of new rules/terms that extend the framework without conflict]

### Conflicts Requiring Decision
| Existing Rule | New Finding | Recommendation | Priority |
|---------------|-------------|----------------|----------|
| ... | ... | ... | High/Medium/Low |

### Gaps Identified
- [Areas where guidelines should exist but currently don't]
```

- This report ensures founders can review and approve changes before they become official.

### Step 11: Output and Save

- Present the complete guidelines document to the user.
- If the user approves:
  - In Layaa AI mode: Suggest specific updates to existing reference files (tone-framework.md, founder-voice.md, content-templates.md). Do NOT overwrite without explicit user approval.
  - In General mode: Offer to save the guidelines as a new file using the Write tool.
- If the user wants revisions, iterate on specific sections.

---

## Output Format

Deliver the guidelines in clean Markdown format with:

1. **Guidelines Document** -- The full structured guide from Step 9.
2. **Source Analysis Summary** -- Brief overview of what materials were analyzed and key patterns found.
3. **Conflict Report** (Layaa AI mode only) -- From Step 10, listing items needing founder review.

---

## Edge Cases

- **Insufficient source material:** If fewer than 3 content samples are available, warn the user that guidelines will be preliminary. Recommend gathering more samples before finalizing. Produce a draft with clear "[NEEDS MORE DATA]" markers on uncertain sections.
- **Contradictory source materials:** If different sources show conflicting voice patterns (e.g., formal website vs. casual social media), treat these as intentional channel adaptations unless the user says otherwise. Document the variation and ask for clarification.
- **Existing guidelines are comprehensive:** If the current framework already covers everything well, say so. Produce a validation report instead of redundant new guidelines. Suggest minor refinements only where warranted.
- **User wants guidelines for a sub-brand or campaign:** Create a child guidelines document that inherits from the parent brand but allows specified deviations. Reference the parent framework explicitly.
- **Multiple founders with very different voices:** Create distinct profiles for each. Note areas of natural convergence and divergence. Provide guidance on when to use which founder's voice.
- **Non-English brand:** Adapt the framework for the target language. Note that some English-specific rules (like banned buzzwords) will need language-appropriate equivalents. Flag this for manual review.
