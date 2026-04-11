---
name: draft-content
description: >
  Draft marketing content including blog posts, social media posts, website copy, whitepapers,
  and thought leadership pieces. Applies brand voice and adapts tone to channel and audience.
  In Layaa AI mode, uses brand voice framework, content templates, and founder voice profiles.
  Trigger: "draft content", "write blog post", "write copy", "social media post", "website copy",
  "thought leadership", "whitepaper draft". This skill replaces the generic marketing:draft-content capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Draft Content

Draft marketing content including blog posts, social media posts, website copy, whitepapers, and thought leadership pieces with brand voice compliance and channel-appropriate formatting.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- shared-references/icp-and-market.md — ICP profiles and personas
- domain-references/brand-voice/tone-framework.md — Brand voice, tone rules, vocabulary guidance
- domain-references/brand-voice/content-templates.md — Content format templates by channel
- domain-references/brand-voice/founder-voice.md — Founder voice profiles for ghostwriting
- domain-references/marketing/target-segments.md — Target segment details and pain points
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Content Parameters
Gather or confirm the following:
- **Content type:** Blog post, LinkedIn post, website page, whitepaper, case study, newsletter, one-pager
- **Channel:** LinkedIn, blog/website, email, social media, print/PDF
- **Target audience:** Which persona or ICP segment
- **Funnel stage:** Awareness, consideration, or decision
- **Topic/subject:** What the content is about
- **Desired length:** Word count or format constraints
- **Voice:** Company voice or specific founder ghostwriting (Abhimanyu or Shubham)

If details are missing, ask the user before proceeding.

### Step 2: Load Voice and Templates (Layaa AI Mode)
For Layaa AI mode:
- Read brand voice framework from `domain-references/brand-voice/tone-framework.md`
- Read content templates from `domain-references/brand-voice/content-templates.md`
- If founder ghostwriting: read founder voice profiles from `domain-references/brand-voice/founder-voice.md`
- Note core voice attributes: confident not arrogant, warm not casual, clear not oversimplified
- Note banned terms: "revolutionary", "game-changing", "disruptive", "cutting-edge", "synergy", "leverage" (verb)
- Note preferred terms: "modernise" (not "modernize"), "organisation" (not "organization") — Indian English

### Step 3: Select Template Structure
Choose the appropriate template from content-templates.md based on content type:
- **Blog post:** Title, intro hook, 3-5 subheaded sections (every 200-300 words), conclusion with CTA
- **LinkedIn post (short):** Hook line, 3-5 short paragraphs with line breaks, CTA, hashtags
- **LinkedIn post (long):** Hook, story/insight, framework or list, takeaway, CTA
- **Website copy:** Headline, subheadline, value props, social proof, CTA
- **Whitepaper:** Executive summary, problem statement, analysis, solution framework, conclusion
- **Case study:** Challenge, approach, solution, results, testimonial
- **Newsletter:** Subject line, intro, 2-3 content blocks, CTA

### Step 4: Research Topic
If the content requires current data or trends:
- Use WebSearch to find recent data, statistics, or industry developments
- Verify any claims or statistics from multiple sources
- Note sources for attribution in the content
- For Layaa AI: ground insights in the context of Indian SME challenges and AI adoption

### Step 5: Draft Content
Write the full draft following the selected template:
- Open with a strong hook relevant to the target audience's pain point or interest
- Maintain consistent voice throughout (brand voice or founder voice as appropriate)
- Use concrete examples and specific details rather than generalities
- Include data points and evidence where relevant
- Keep sentences concise — aim for 15-20 words average
- Use active voice predominantly
- Break up long paragraphs (max 3-4 sentences per paragraph)

### Step 6: Apply Channel-Specific Formatting
Format the content for the target channel:
- **LinkedIn:** Short paragraphs (1-2 sentences), use line breaks for readability, emojis sparingly if at all
- **Blog:** Subheadings every 200-300 words, bullet points for lists, bold key phrases
- **Website:** Scannable layout, clear hierarchy, prominent CTAs
- **Email:** Short paragraphs, single column, mobile-friendly length
- **Whitepaper/PDF:** Professional formatting, numbered sections, executive summary

### Step 7: Add Call-to-Action
Include a CTA appropriate to the funnel stage:
- **Awareness stage:** Soft/educational — "Read more", "Learn how", "Explore the guide"
- **Consideration stage:** Engagement — "Book a free assessment", "Download the framework", "Watch the demo"
- **Decision stage:** Action-driven — "Schedule a consultation", "Start your project", "Get your custom roadmap"
- Layaa AI: CTAs should reference the Discovery → Assessment → Development → Validation → Enablement methodology where appropriate

### Step 8: Self-Review Against Brand Voice
Review the draft against brand voice guidelines:
- **DO:** Sound knowledgeable, practical, approachable, solution-oriented
- **DON'T:** Sound salesy, hyperbolic, jargon-heavy, or condescending
- Check for banned terms and replace with approved alternatives
- Verify Indian English spelling conventions
- Ensure claims are defensible and not overpromising
- Confirm tone matches the audience (more technical for CTOs, more strategic for founders)

## Output Format

```
# Content Draft: [Title/Topic]
**Type:** [blog post/LinkedIn post/website copy/etc.]
**Channel:** [where it will be published]
**Target Audience:** [persona/ICP]
**Funnel Stage:** [awareness/consideration/decision]
**Word Count:** [count]
**Voice:** [company/founder name]

---

[Full content draft with formatting applied]

---

## Content Notes
- **CTA:** [the call-to-action used and rationale]
- **SEO keywords** (if applicable): [keyword list]
- **Hashtags** (if social): [hashtag recommendations]
- **Internal links** (if blog): [suggested internal link opportunities]
- **Image/visual suggestions:** [recommended visuals or graphics]
- **Brand voice compliance:** [any flags or notes from self-review]
```

## What Makes This Different from Generic Content Drafting
- Applies Layaa AI's specific brand voice framework with DO/DON'T rules and vocabulary guidance
- Uses founder voice profiles for authentic ghostwriting (distinct profiles for Abhimanyu and Shubham)
- Content templates match Layaa AI's established format standards per channel
- Topics ground naturally in Layaa AI's content pillars (AI for SMEs, automation, workflow optimization)
- CTAs align with Layaa AI's sales methodology and funnel stages
- Uses Indian English conventions and avoids Western-centric examples
- Messaging connects to specific ICP pain points rather than generic value propositions
