---
name: seo-audit
description: >
  Perform SEO analysis of content, web pages, or overall site strategy. Evaluates keyword targeting,
  on-page optimization, content gaps, and provides actionable SEO improvement recommendations.
  In Layaa AI mode, benchmarks against target keywords and content pillars. Trigger: "seo audit",
  "seo analysis", "keyword analysis", "on-page seo", "content gaps", "seo review", "search optimization".
  This skill replaces the generic marketing:seo-audit capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# SEO Audit

Perform SEO analysis of content, web pages, or overall site strategy, evaluating keyword targeting, on-page optimization, content gaps, and providing actionable improvement recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics and positioning
- shared-references/icp-and-market.md — ICP profiles and market context
- domain-references/marketing/channel-playbooks.md — SEO strategy and target keywords
- domain-references/marketing/gtm-strategy.md — GTM strategy and content pillars
- domain-references/marketing/target-segments.md — Target segments and search intent mapping
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Audit Scope
Determine what is being audited:
- **Single page audit:** Analyze one specific URL or content piece for on-page SEO
- **Content piece audit:** Review a draft or published article for SEO optimization
- **Strategy-level audit:** Evaluate overall SEO approach, keyword strategy, and content gaps
- Ask the user for the URL, content, or strategy details
- Confirm the target audience and primary business goals for the content

### Step 2: Load SEO Targets (Layaa AI Mode)
For Layaa AI mode, load SEO targets from channel playbooks:
- **Primary keywords:** "AI automation for small business India", "workflow automation India", "SME AI solutions"
- **Secondary keywords:** "no-code automation", "business process automation", "AI consulting India", "automation for startups"
- **Long-tail keywords:** "how to automate business processes for SMEs", "AI adoption for Indian businesses", "workflow automation consulting Gurgaon"
- **Content pillar keywords:** Map keywords to content pillars (AI for SMEs, automation case studies, workflow optimization, future of work)
- Note the intent type for each keyword (informational, navigational, commercial, transactional)

### Step 3: Analyze Keyword Targeting and Density
Evaluate keyword usage in the content:
- **Primary keyword:** Present in title, H1, first 100 words, and naturally throughout
- **Keyword density:** 1-2% for primary keyword (not over-optimized)
- **Semantic variations:** Related terms and synonyms used naturally
- **Keyword stuffing check:** Flag any unnatural keyword repetition
- **Search intent match:** Does the content match the search intent for the target keyword?
- If no keywords are targeted, recommend keywords based on the topic and Layaa AI's SEO strategy

### Step 4: Evaluate On-Page SEO Elements
Check technical on-page elements:
- **Title tag:** 50-60 characters, includes primary keyword, compelling for clicks
- **Meta description:** 150-160 characters, includes keyword, has clear value proposition and CTA
- **H1 tag:** Unique, includes primary keyword, matches search intent
- **Heading hierarchy:** Proper H2/H3/H4 structure, keywords in subheadings where natural
- **URL structure:** Short, descriptive, includes keyword, uses hyphens
- **Internal linking:** Links to relevant content, descriptive anchor text, reasonable link count
- **External linking:** Links to authoritative sources where appropriate
- **Image optimization:** Alt text with keywords, compressed file sizes, descriptive filenames
- **Mobile readability:** Short paragraphs, scannable structure, appropriate font considerations

### Step 5: Assess Content Quality and Relevance
Evaluate the content from an SEO perspective:
- **Content depth:** Is the topic covered comprehensively? (aim for topical authority)
- **Word count:** Appropriate for the topic and search intent (informational: 1500-2500 words, transactional: 500-1000 words)
- **Freshness:** Is the content current and up-to-date?
- **Uniqueness:** Does it offer a unique perspective or data not found elsewhere?
- **E-E-A-T signals:** Experience, Expertise, Authoritativeness, Trustworthiness indicators
- **User engagement:** Scannable format, clear structure, compelling introduction
- **Featured snippet opportunities:** Can any content be structured to win featured snippets (lists, tables, definitions)?

### Step 6: Identify Content Gaps
Find topics the target audience searches for that are not covered:
- Use WebSearch to research related search queries and "People Also Ask" patterns
- Identify competitor content ranking for target keywords
- Map gaps against Layaa AI's content pillars to find strategic opportunities
- Prioritize gaps by search volume potential and relevance to business goals
- For Layaa AI, check coverage of key topics:
  - AI adoption guides for specific industries (SaaS, logistics, fintech, professional services)
  - Automation ROI calculators and frameworks
  - Comparison content (DIY vs managed automation, enterprise vs SME solutions)
  - How-to content for common automation use cases
  - Thought leadership on AI trends in Indian business

### Step 7: Map Content Pillars to SEO Strategy (Layaa AI Mode)
Ensure content pillars are well-represented in SEO strategy:
1. **AI for SMEs:** Target informational and commercial keywords about AI adoption for small businesses
2. **Automation case studies:** Target long-tail keywords about specific automation outcomes and ROI
3. **Workflow optimization:** Target how-to and process-related keywords
4. **Future of work:** Target trend and thought leadership keywords for brand authority
- Identify which pillars are well-optimized and which need more content

### Step 8: Generate Prioritized Recommendations
Create a prioritized action plan:
- **Quick wins:** Changes that can be made immediately with high impact (title tags, meta descriptions, internal links)
- **Medium-term:** Content updates, new content pieces, structural improvements
- **Long-term:** Content strategy shifts, new content pillars, link building strategy
- Estimate effort and impact for each recommendation
- For Layaa AI: align recommendations with GTM timeline and content calendar

## Output Format

```
# SEO Audit Report
**Scope:** [single page / content piece / strategy-level]
**URL/Content:** [what was audited]
**Date:** [date]
**Target Keywords:** [primary and secondary keywords]

## Executive Summary
- **Overall SEO Score:** [Strong / Adequate / Needs Work / Poor]
- [Key finding 1]
- [Key finding 2]
- [Key finding 3]

## On-Page SEO Scorecard

| Element | Status | Finding | Recommendation |
|---------|--------|---------|----------------|
| Title Tag | [Pass/Fail/Improve] | [current state] | [action] |
| Meta Description | [Pass/Fail/Improve] | [current state] | [action] |
| H1 Tag | [Pass/Fail/Improve] | [current state] | [action] |
| Heading Structure | [Pass/Fail/Improve] | [current state] | [action] |
| URL Structure | [Pass/Fail/Improve] | [current state] | [action] |
| Internal Links | [Pass/Fail/Improve] | [current state] | [action] |
| Image Optimization | [Pass/Fail/Improve] | [current state] | [action] |
| Keyword Usage | [Pass/Fail/Improve] | [current state] | [action] |

## Keyword Analysis

| Keyword | Intent | Current Usage | Recommendation |
|---------|--------|---------------|----------------|
| [keyword] | [type] | [how used] | [action] |

## Content Quality Assessment
- **Depth:** [score and notes]
- **Uniqueness:** [score and notes]
- **E-E-A-T:** [score and notes]
- **Engagement:** [score and notes]

## Content Gap Opportunities

| Topic/Keyword | Search Intent | Priority | Content Type | Pillar |
|---------------|--------------|----------|-------------|--------|
| [topic] | [intent] | [H/M/L] | [blog/guide/etc.] | [pillar] |

## Prioritized Action Items

### Quick Wins (This Week)
1. [Action — specific and implementable]
2. [Action — specific and implementable]

### Medium-Term (This Month)
1. [Action — specific and implementable]
2. [Action — specific and implementable]

### Long-Term (This Quarter)
1. [Action — specific and implementable]
2. [Action — specific and implementable]

## Summary
[2-3 sentence summary of SEO health and top priorities]
```

## What Makes This Different from Generic SEO Audits
- Benchmarks against Layaa AI's specific target keywords and SEO strategy
- Maps content gaps to Layaa AI's four content pillars for strategic alignment
- Evaluates keyword opportunities through the lens of Indian SME search behavior
- Connects SEO recommendations to GTM strategy and pipeline goals
- Identifies industry-specific content opportunities for each ICP segment
- Prioritizes actions aligned with Layaa AI's content calendar and marketing timeline
