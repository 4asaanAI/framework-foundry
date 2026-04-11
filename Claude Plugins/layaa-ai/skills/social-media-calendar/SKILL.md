---
name: social-media-calendar
description: >
  Generate weekly social media content calendars for company pages and founder LinkedIn profiles.
  Plans post topics, formats, timing, and content mix aligned with marketing strategy. Includes
  draft copy for each post. In Layaa AI mode, uses content pillars, founder voice profiles, and
  channel playbooks. Trigger: "social media calendar", "content calendar", "weekly posts",
  "linkedin calendar", "social plan", "posting schedule". This is a new Layaa AI-specific skill.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Social Media Calendar

Generate weekly social media content calendars for company pages and founder LinkedIn profiles, including post topics, formats, timing, content mix, and draft copy for each post.

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
- domain-references/brand-voice/content-templates.md — Content format templates (social post structures)
- domain-references/brand-voice/founder-voice.md — Individual founder voice profiles
- domain-references/marketing/gtm-strategy.md — GTM strategy and content pillars
- domain-references/marketing/channel-playbooks.md — Channel strategy and content mix ratios
- domain-references/marketing/target-segments.md — Target segments and persona details
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Determine Calendar Scope
Clarify the calendar parameters:
- **Time period:** Weekly or monthly calendar
- **Accounts:** Which accounts to plan for (company page, Abhimanyu's LinkedIn, Shubham's LinkedIn)
- **Platforms:** LinkedIn, Twitter/X, Instagram, or others
- **Any specific themes, launches, events, or announcements** to incorporate
- **Content already planned or published** to avoid duplication
- Confirm scope with the user before proceeding

### Step 2: Load Content Mix Ratios (Layaa AI Mode)
For Layaa AI mode, load content mix from channel playbooks:

| Content Type | Ratio | Purpose |
|-------------|-------|---------|
| Thought Leadership | 40% | Industry insights, AI trends, founder perspectives, opinion pieces |
| Educational | 30% | How-to content, frameworks, tips, explainers about AI and automation |
| Building in Public | 20% | Behind-the-scenes, team updates, milestone sharing, lessons learned |
| Product/Service Updates | 10% | New services, case study highlights, client wins, feature announcements |

Apply these ratios across the weekly calendar to maintain a balanced content mix.

### Step 3: Load Founder Voice Profiles
For founder LinkedIn content:
- Read founder voice profiles from `domain-references/brand-voice/founder-voice.md`
- Note each founder's distinct communication style, topics of expertise, and voice patterns
- Abhimanyu's profile: [load specific attributes from reference]
- Shubham's profile: [load specific attributes from reference]
- Ensure each founder's posts sound authentically like them, not generic company content

### Step 4: Map Content to Personas and Funnel Stages
Plan content with audience intent in mind:
- Map each post to a target persona (Founder/CEO, COO, CTO, CFO)
- Assign funnel stage relevance (awareness, consideration, decision)
- Ensure the week covers multiple personas and funnel stages
- Balance between content that attracts new audience and content that nurtures existing followers

### Step 5: Plan Posting Frequency
Set the posting schedule:
- **Founder profiles:** 3-5 posts per week each
- **Company page:** 2-3 posts per week
- Optimal posting times for B2B LinkedIn in India: Tuesday-Thursday, 8-10am IST and 12-2pm IST
- Avoid weekends for B2B content (unless building-in-public personal posts)
- Space posts at least 4-6 hours apart on the same account
- Vary posting times to reach different time zones if targeting international audience

### Step 6: Generate Post Topics
Create topics aligned with content pillars:

**Content Pillars for Layaa AI:**
1. **AI for SMEs** — Practical AI adoption stories, demystifying AI for small business owners, busting AI myths
2. **Automation case studies** — Workflow transformations, before/after scenarios, ROI demonstrations, client stories
3. **Workflow optimization** — Process improvement frameworks, efficiency tips, operational excellence
4. **Future of work** — AI workforce trends, human-AI collaboration, industry predictions, thought leadership

For each topic:
- Assign to a content pillar
- Match to a content type (thought leadership, educational, building in public, product update)
- Note the target persona
- Ensure variety across the week — no two consecutive posts on the same pillar

### Step 7: Draft Copy for Each Post
Write complete draft copy for each post:

**Short-form thought leadership (150-200 words):**
- Strong hook line (first line visible before "see more")
- 3-5 short paragraphs with line breaks
- Clear takeaway or insight
- CTA (engage, comment, share)

**Long-form post (300-500 words):**
- Hook line
- Story or case study
- Framework, list, or key insights
- Takeaway and CTA

**Building in public (100-200 words):**
- Personal, authentic tone
- Specific detail or milestone
- Lesson learned or reflection
- Community engagement CTA

**Product/service update (100-150 words):**
- News hook
- What changed and why it matters
- Benefit to the audience
- CTA (learn more, book a call)

Apply brand voice rules to all posts. Use Indian English conventions.

### Step 8: Add Posting Details
For each post, specify:
- **Optimal posting time:** Specific day and time recommendation
- **Hashtags:** 3-5 relevant hashtags (mix of broad and niche)
  - Layaa AI standard hashtags: #AIforSMEs, #WorkflowAutomation, #AIAdoption, #IndianStartups, #AutomationForBusiness
  - Topic-specific hashtags based on content
- **Media recommendations:** Image, carousel, document, video, or text-only
- **Engagement prompt:** Question or invitation to comment

### Step 9: Include Engagement Strategy Notes
Add engagement recommendations:
- **Communities to engage in:** Relevant LinkedIn groups, comment threads of industry leaders
- **Comment strategy:** Spend 15-20 minutes before and after posting engaging with others' content
- **Reply strategy:** Respond to all comments within 2-4 hours of posting
- **Cross-promotion:** Share founder posts from company page and vice versa
- **Employee amplification:** Note posts that should be shared by team members

### Step 10: Flag Posts for Review (Layaa AI Mode)
For Layaa AI mode, flag posts that need founder attention:
- Posts attributed to a specific founder — requires their review and approval
- Posts referencing client work — requires confidentiality check
- Posts with specific claims or metrics — requires verification
- Posts about company strategy or direction — requires founder sign-off
- Mark each flagged post with the review reason and approver

## Output Format

```
# Social Media Calendar: [Week/Period]
**Period:** [date range]
**Accounts:** [company page, founder profiles]
**Total Posts:** [count]
**Content Mix:**

| Type | Target % | Actual % | Posts |
|------|----------|----------|-------|
| Thought Leadership | 40% | [%] | [count] |
| Educational | 30% | [%] | [count] |
| Building in Public | 20% | [%] | [count] |
| Product Updates | 10% | [%] | [count] |

## Weekly Calendar

| Day | Account | Time | Type | Pillar | Topic | Status |
|-----|---------|------|------|--------|-------|--------|
| Mon | [account] | [time] | [type] | [pillar] | [topic] | [draft/needs review] |
| Tue | [account] | [time] | [type] | [pillar] | [topic] | [draft/needs review] |
| ... | ... | ... | ... | ... | ... | ... |

## Post Drafts

### [Day] — [Account] — [Topic]
**Type:** [thought leadership/educational/building in public/product update]
**Pillar:** [content pillar]
**Target Persona:** [persona]
**Funnel Stage:** [awareness/consideration/decision]
**Post Time:** [day, time IST]

---

[Full post copy]

---

**Hashtags:** [hashtag list]
**Media:** [image/carousel/document/video/text-only — description of visual if needed]
**Engagement prompt:** [suggested question or CTA]
**Review needed:** [Yes — reason / No]

---

[Repeat for each post]

## Engagement Plan
- **Pre-posting engagement:** [specific communities or people to engage with]
- **Post-publishing:** [reply and engagement strategy]
- **Cross-promotion:** [which posts to amplify]

## Posts Flagged for Review

| Post | Day | Account | Reason | Approver |
|------|-----|---------|--------|----------|
| [topic] | [day] | [account] | [reason] | [founder name] |

## Notes
- [Any scheduling conflicts, upcoming events, or strategic considerations]
- [Recommendations for next week based on this week's themes]
```

## What Makes This Different from Generic Social Media Calendars
- Uses Layaa AI's specific content mix ratios (40/30/20/10) from channel playbooks
- Applies individual founder voice profiles for authentic LinkedIn ghostwriting
- Aligns all content with Layaa AI's four content pillars for strategic consistency
- Posting frequency and timing optimized for B2B LinkedIn in the Indian market
- Includes Layaa AI's standard hashtag strategy and engagement approach
- Flags posts requiring founder review with specific reasons
- Connects social content to ICP personas and funnel stages for measurable impact
- Drafts copy that follows Layaa AI brand voice rules (tone, vocabulary, Indian English)
