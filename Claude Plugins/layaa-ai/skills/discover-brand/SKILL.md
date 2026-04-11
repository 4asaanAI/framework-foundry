---
name: discover-brand
description: >
  Search connected platforms for brand materials and produce a discovery report.
  In Layaa AI mode, audits existing content against established brand framework.
  Replaces generic brand-voice:discover-brand.
  Trigger: "discover brand", "brand audit", "brand discovery", "find brand materials"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Discover Brand -- Brand Discovery and Audit Skill

Search for brand-related content across connected sources, local files, and web platforms. Analyze discovered materials for voice consistency, identify drift areas, and produce a comprehensive discovery report. In Layaa AI mode, audit found content against the established brand framework.

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

### Step 1: Define Discovery Scope

- Clarify the scope of the discovery with the user:
  - **Full discovery:** Search everywhere accessible for all brand-related content.
  - **Platform-specific:** Focus on a particular channel (LinkedIn, website, email templates, proposals).
  - **Time-bound:** Only look at content from a specific date range.
  - **Content-type focused:** Only look at a specific type (social posts, emails, website pages, sales materials).
- Identify available sources:
  - **Local files:** Documents, presentations, templates in the workspace.
  - **Connected platforms:** Email (Gmail), design tools (Canva, Figma), CRM, marketing platforms (Klaviyo).
  - **Web presence:** Company website, LinkedIn profiles, social media accounts.
  - **Third-party mentions:** Press coverage, partner content, directory listings.
- Confirm which sources the user wants searched and which are accessible via connected tools.

### Step 2: Load Brand Framework (Layaa AI Mode)

- Read all reference files to establish the baseline for comparison:
  - `domain-references/brand-voice/tone-framework.md` -- The rules content should follow.
  - `domain-references/brand-voice/founder-voice.md` -- Individual voice profiles for attribution check.
  - `domain-references/brand-voice/content-templates.md` -- Channel formatting standards.
  - `shared-references/company-identity.md` -- Core messaging and positioning.
  - `shared-references/icp-and-market.md` -- Target audience definition.
- Build a checklist of brand rules to evaluate each discovered piece of content against.
- In General mode: Skip this step. Discovery will catalog materials without evaluating against a framework (unless the user provides guidelines separately).

### Step 3: Search Local Files

- Use Glob to search for brand-related files in the workspace:
  - `**/*.md` -- Markdown content files.
  - `**/*.txt` -- Text documents, prompts, guidelines.
  - `**/*.docx` -- Word documents (note: may need conversion).
  - `**/*.pdf` -- Presentations, proposals, collateral.
- Use Grep to search file contents for brand-relevant terms:
  - Company name and variations.
  - Founder names.
  - Product/service names.
  - Key messaging phrases from the tone framework.
  - Taglines and positioning statements.
- Catalog each discovered file with:
  - File path.
  - Content type (proposal, social post, email template, website copy, internal doc).
  - Date modified (from file metadata).
  - Brief content summary (first 100 words or key heading).
  - Attribution (if identifiable -- which founder or team member).

### Step 4: Search Connected Platforms

- Based on available connected tools, search each platform:
  - **Gmail:** Search for sent emails containing brand content, templates, outreach.
  - **Canva:** Search designs for branded materials, social media posts, presentations.
  - **Figma:** Search for brand design assets, UI copy, marketing materials.
  - **Klaviyo:** Search email campaigns, templates, automations for brand content.
  - **Calendar:** Check for events with brand-related descriptions or agendas.
- For each platform, catalog found materials the same way as local files.
- Note which platforms were searched and which were unavailable or returned no results.

### Step 5: Search Web Presence

- Use WebSearch to find the brand's public content:
  - Company website pages (home, about, services, blog).
  - LinkedIn company page posts and articles.
  - Founder LinkedIn profiles and posts.
  - Social media accounts (Twitter/X, Instagram, YouTube).
  - Press mentions and third-party articles.
  - Review sites, directory listings, partner pages.
  - Job postings (these reflect employer brand voice).
- Use WebFetch to retrieve and analyze key pages.
- Catalog each web source with URL, content type, date (if available), and content summary.
- In General mode: This may be the primary discovery channel if no local files or connected platforms are available.

### Step 6: Categorize Discovered Materials

- Organize all discovered content into categories:

```
## Discovery Inventory

### By Channel
- LinkedIn: [count] pieces
- Website: [count] pages
- Email: [count] templates/campaigns
- Proposals: [count] documents
- Internal: [count] documents
- Other: [count] items

### By Content Type
- Thought leadership / educational
- Sales / promotional
- Operational / internal
- Brand assets / design
- Legal / compliance

### By Attribution
- Founder 1 (Abhimanyu Singh): [count] pieces
- Founder 2 (Shubham Sharma): [count] pieces
- Company (unattributed): [count] pieces
- Third-party: [count] pieces

### By Recency
- Last 30 days: [count]
- Last 90 days: [count]
- Last 6 months: [count]
- Older: [count]
```

### Step 7: Evaluate Voice Consistency (Layaa AI Mode)

- For each discovered piece of content, evaluate against the brand framework:
  - **Tone alignment:** Does it match the core voice attributes (confident, intelligent, approachable, action-oriented)?
  - **Vocabulary compliance:** Does it contain banned terms? Does it use preferred vocabulary?
  - **Channel formatting:** Does it follow channel-specific rules from the content templates?
  - **ICP alignment:** Does it speak to the right audience with relevant pain points?
  - **Founder voice accuracy:** If attributed to a founder, does it match their voice profile?
- Assign each piece a consistency rating:
  - **Strong (8-10):** Fully aligned with brand framework. Minor or no issues.
  - **Moderate (5-7):** Generally on-brand but with notable deviations. Fixable with light editing.
  - **Weak (2-4):** Significant misalignment. Needs substantial revision.
  - **Off-brand (0-1):** Does not represent the brand voice at all. Consider removal or complete rewrite.
- In General mode: Without a framework to compare against, focus on internal consistency. Note patterns and variations across content without scoring.

### Step 8: Identify Drift Areas

- Analyze the consistency ratings to identify patterns of drift:
  - **Channel drift:** Is one channel consistently weaker than others? (e.g., social media on-brand but proposals off-brand)
  - **Temporal drift:** Has voice consistency changed over time? Is recent content more or less aligned?
  - **Attribution drift:** Does one person's content drift more than another's?
  - **Topic drift:** Are certain subject areas more prone to voice inconsistency?
  - **Vocabulary drift:** Are banned terms creeping back in? Are preferred terms being abandoned?
- For each drift area, identify:
  - The specific pattern of deviation.
  - Likely cause (new team member writing, time pressure, channel unfamiliarity, guideline gaps).
  - Impact severity (how much this affects brand perception).

### Step 9: Generate Recommendations

- Based on the drift analysis, produce actionable recommendations:
  - **Immediate fixes:** Content that should be revised now (high-visibility, off-brand pieces).
  - **Template updates:** Channel templates that need refreshing or creating.
  - **Guideline gaps:** Areas where the brand framework needs new rules or clearer rules.
  - **Training needs:** Patterns suggesting someone needs a voice refresher.
  - **Content opportunities:** Channels or content types where the brand is underrepresented.
  - **Archival candidates:** Old content that no longer represents the brand and should be retired.
- Prioritize recommendations as High / Medium / Low based on:
  - Audience reach (how many people see this content).
  - Brand impact (how much it affects perception).
  - Effort to fix (quick edit vs. full rewrite).

### Step 10: Compile Discovery Report

- Produce the final discovery report:

```
# Brand Discovery Report -- [Brand Name]
**Date:** [current date]
**Scope:** [what was searched]
**Sources Searched:** [list of platforms and locations]

## Executive Summary
- [2-3 sentence overview of findings]
- Overall voice consistency score: [X/10]
- Materials discovered: [total count]
- Items needing attention: [count]

## Discovery Inventory
[From Step 6 -- categorized inventory]

## Voice Consistency Analysis
### Consistency Distribution
| Rating | Count | Percentage |
|--------|-------|------------|
| Strong (8-10) | ... | ...% |
| Moderate (5-7) | ... | ...% |
| Weak (2-4) | ... | ...% |
| Off-brand (0-1) | ... | ...% |

### Channel Breakdown
| Channel | Avg. Score | Strongest Area | Weakest Area |
|---------|-----------|----------------|--------------|
| LinkedIn | ... | ... | ... |
| Website | ... | ... | ... |
| Email | ... | ... | ... |
| Proposals | ... | ... | ... |

## Drift Analysis
### Key Drift Areas
1. [Drift area with evidence and severity]
2. [Drift area with evidence and severity]
3. [Drift area with evidence and severity]

## Recommendations
### High Priority
- [ ] [Recommendation with specific content reference]
### Medium Priority
- [ ] [Recommendation]
### Low Priority
- [ ] [Recommendation]

## Detailed Findings
[Per-item analysis for items scoring below 7, with specific issues noted]

## Appendix: Materials Catalog
[Complete list of all discovered materials with metadata]
```

### Step 11: Flag for Founder Review

- Highlight any findings that require founder attention:
  - Content that misrepresents the company or founders.
  - Third-party content with inaccurate claims about the brand.
  - Significant voice drift that may indicate a strategic shift (intentional or not).
  - Guideline gaps that only founders can resolve (positioning decisions, new market messaging).
- Present these as a separate, concise section at the top of the report for quick founder review.

---

## Output Format

Deliver the complete discovery report in Markdown format. Structure it for easy scanning:

1. **Executive Summary** -- The top-level findings in 3-5 sentences. Founders should be able to read just this and know the state of brand voice.
2. **Full Report** -- The detailed report from Step 10.
3. **Action Items** -- Extracted as a standalone checklist, prioritized and assignable.

If the report is extensive, offer to save it as a file using the Write tool.

---

## Edge Cases

- **No connected platforms available:** Focus on local files and web search. Note the limitation in the report and recommend connecting relevant platforms for a more complete audit.
- **No existing brand framework (General mode):** Produce a discovery-only report without consistency scoring. Instead, identify the emergent voice patterns and recommend creating formal guidelines (suggest the generate-guidelines skill).
- **Very large content volume:** If more than 50 pieces of content are discovered, prioritize evaluation of high-visibility content (website home page, recent LinkedIn posts, active email campaigns). Provide summary statistics for the rest. Offer to do a deep-dive on specific channels in a follow-up.
- **Mixed-brand content:** If discovered content serves multiple brands or sub-brands, separate the analysis by brand. Note which brand each piece belongs to.
- **Stale content:** If significant amounts of content are outdated (more than 12 months old), flag this separately. Stale content can still appear in search results and shape brand perception.
- **Third-party content inaccuracies:** If web search reveals third-party content with incorrect information about the brand, flag these for correction outreach. Include the URL and the specific inaccuracy.
- **Platform access failures:** If a connected platform search fails or times out, note it in the report. Do not silently skip it. Suggest the user retry or check permissions.
