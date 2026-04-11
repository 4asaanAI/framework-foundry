---
name: content-creation
description: >
  End-to-end content creation workflow from ideation to final draft. Generates content briefs,
  outlines, and full drafts for any marketing channel. Handles batch content creation for content
  calendars. In Layaa AI mode, aligns with content pillars and GTM strategy. Trigger: "create content",
  "content brief", "content calendar batch", "content plan", "batch content", "content pipeline".
  This skill replaces the generic marketing:content-creation capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Content Creation

End-to-end content creation workflow from ideation to final draft, including content briefs, outlines, and full drafts for any marketing channel. Supports batch creation for content calendars.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/service-verticals.md — Services and methodology
- domain-references/brand-voice/tone-framework.md — Brand voice and tone rules
- domain-references/brand-voice/content-templates.md — Content format templates
- domain-references/marketing/gtm-strategy.md — GTM strategy and content pillars
- domain-references/marketing/channel-playbooks.md — Channel-specific strategies
- domain-references/marketing/target-segments.md — Target segment details
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Understand Content Requirements
Gather content specifications from the user:
- **Topic(s):** What subject matter to cover
- **Format(s):** Blog, LinkedIn, newsletter, whitepaper, case study, one-pager, social post
- **Channel(s):** Where the content will be published
- **Audience:** Which persona or ICP segment
- **Quantity:** Single piece or batch (for content calendar)
- **Timeline:** When the content is needed
- **Any specific angles, data, or references** the user wants included

If requirements are unclear, ask before proceeding.

### Step 2: Load Content Pillars (Layaa AI Mode)
For Layaa AI mode, load content pillars from GTM strategy:
1. **AI for SMEs** — Practical AI adoption stories, demystifying AI for small business owners
2. **Automation case studies** — Real workflow transformations, before/after scenarios, ROI demonstrations
3. **Workflow optimization** — Process improvement frameworks, efficiency gains, operational excellence
4. **Future of work** — AI workforce trends, human-AI collaboration, industry predictions

Map each content piece to one or more pillars. Ensure batch content covers all pillars proportionally.

### Step 3: Generate Content Brief
For each content piece, create a brief:
- **Objective:** What the content should achieve (awareness, education, lead generation, thought leadership)
- **Key messages:** 2-3 core messages the content must convey
- **Target persona:** Specific ICP segment and their pain points
- **Funnel stage:** Awareness, consideration, or decision
- **SEO keywords** (if applicable): Primary and secondary keywords
- **Tone:** Voice guidelines for this specific piece
- **Reference materials:** Any sources, data, or existing content to build on
- **Success metric:** How effectiveness will be measured

### Step 4: Create Outline
Build a detailed outline following the appropriate template:
- **Blog post:** Title options (3), intro hook, 3-5 sections with subheadings, key points per section, conclusion approach, CTA
- **LinkedIn post:** Hook line options (3), body structure, takeaway, CTA
- **Whitepaper:** Executive summary points, chapter breakdown, data/research needs, conclusion framework
- **Case study:** Client context, challenge definition, solution approach, results framework, quote placeholders
- **Newsletter:** Subject line options (3), intro angle, content blocks, CTA

For batch creation: generate all outlines before writing any drafts to ensure variety and coverage.

### Step 5: Write Full Draft
Write the complete draft for each content piece:
- Follow the outline structure precisely
- Apply brand voice from tone-framework.md (confident, clear, practical, warm)
- Use concrete examples and specific details
- Include data points with sources where relevant
- Maintain consistent voice across batch pieces while varying angles and hooks
- For Layaa AI: use Indian English, avoid banned terms, reference the methodology where natural

### Step 6: Batch Consistency (for Multiple Pieces)
When creating multiple content pieces:
- Ensure consistent brand voice across all pieces
- Vary angles and hooks — no two pieces should open the same way
- Cover different content pillars across the batch
- Target different personas or funnel stages for variety
- Cross-reference pieces to avoid repetition of examples or data points
- Create a batch summary showing the content mix

### Step 7: Add Metadata
For each content piece, include:
- **Meta description** (if blog/web): 150-160 characters summarizing the content
- **Tags/categories:** Topic tags for content management
- **SEO keywords:** Primary and secondary (if applicable)
- **Hashtags** (if social): 3-5 relevant hashtags
- **Internal link opportunities:** Other content to link to/from
- **Image/visual needs:** Describe any graphics, charts, or images needed

### Step 8: Quality Check
Review all content against brand guidelines:
- Voice compliance (tone, vocabulary, banned terms)
- Accuracy of claims and data
- Formatting correctness for target channel
- CTA appropriateness for funnel stage
- Spelling and grammar (Indian English conventions)
- No repetition across batch pieces
- Each piece serves its stated objective

## Output Format

### Single Piece:
```
# Content Brief
**Topic:** [topic]
**Format:** [format]
**Channel:** [channel]
**Target Persona:** [persona/ICP]
**Funnel Stage:** [stage]
**Content Pillar:** [pillar]
**SEO Keywords:** [if applicable]

## Outline
[Structured outline]

---

## Full Draft

[Complete content with formatting]

---

## Metadata
- **Meta description:** [description]
- **Tags:** [tags]
- **Hashtags:** [if social]
- **Image needs:** [visual descriptions]
- **Internal links:** [link opportunities]
- **Word count:** [count]
```

### Batch Creation:
```
# Content Batch: [Batch Name/Period]
**Total Pieces:** [count]
**Content Mix:**

| # | Topic | Format | Channel | Persona | Pillar | Status |
|---|-------|--------|---------|---------|--------|--------|
| 1 | [topic] | [format] | [channel] | [persona] | [pillar] | Draft |
| 2 | [topic] | [format] | [channel] | [persona] | [pillar] | Draft |

---

## Piece 1: [Title]
[Brief + Outline + Full Draft + Metadata]

---

## Piece 2: [Title]
[Brief + Outline + Full Draft + Metadata]

---
[Continue for all pieces]
```

## What Makes This Different from Generic Content Creation
- Aligns all content with Layaa AI's four content pillars for strategic consistency
- Batch creation ensures proportional coverage across pillars, personas, and funnel stages
- Uses Layaa AI's specific content templates and formatting standards per channel
- Applies brand voice framework with vocabulary guidance and banned terms list
- Content briefs connect to ICP pain points and GTM strategy for measurable impact
- Quality checks enforce Indian English conventions and Layaa AI-specific compliance rules
- Metadata includes Layaa AI's standard tagging and SEO keyword strategy
