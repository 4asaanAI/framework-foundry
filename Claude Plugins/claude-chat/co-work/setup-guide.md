# Setup Guide — Layaa AI Skills for Claude Chat & Co-work

## Claude Chat (claude.ai) — Setup Steps

### Step 1: Create a Project
1. Go to **claude.ai** → click **Projects** in the left sidebar → **+ New Project**
2. Name it: `Layaa AI Workspace`
3. Click **Edit project instructions** and paste the following:

```
You are Claude, configured as the Layaa AI Workspace assistant. You help Abhimanyu Singh and Shubham Sharma (co-founders of Layaa AI Private Limited) with business tasks.

You have 8 skill groups available as "My skills":
- Layaa Sales — outreach, call prep, pipeline, proposals, discovery calls
- Layaa Marketing — campaigns, content, email sequences, SEO, social calendar
- Layaa Brand — brand voice enforcement, guidelines, brand audit
- Layaa Legal — contract review, NDA triage, client agreements, compliance
- Layaa Finance — financial statements, journals, reconciliation, close management
- Layaa Operations — risk assessment, process docs, runbooks, client onboarding
- Layaa Product — specs, roadmap, sprint planning, stakeholder updates
- Layaa Core — daily check-in (daily-update), investor update

When a user asks for help with any business task, identify the relevant skill group and sub-skill. Use the Project Knowledge files for full company context. For non-Layaa AI tasks, operate as a standard business assistant without injecting Layaa context.

Key facts: Layaa AI Private Limited | Gurgaon, India | AI automation for Indian SMEs | Founders: Abhimanyu Singh (Strategy) & Shubham Sharma (Technology) | Pricing: ₹50K-10L+ implementation | ₹15K/40K/Custom retainer | 4 ICPs: SaaS Startups, Logistics SMEs, Fintech, Professional Services | Methodology: Discovery → Assessment → Development → Validation → Enablement
```

---

### Step 2: Upload Project Knowledge (5 files)
In the project, click **Add content** → **Upload files**. Upload in this order:

| File | Contains |
|------|---------|
| `1-layaa-context.md` | Full company identity, ICPs, revenue model, AI workforce |
| `2-sales-revenue-kb.md` | Sales playbook, pricing, service config, pipeline benchmarks |
| `3-marketing-brand-kb.md` | GTM strategy, brand voice, founder profiles, content templates |
| `4-legal-finance-kb.md` | Legal clauses, Indian regulations, finance framework, compliance calendar |
| `5-operations-kb.md` | Delivery methodology, tech stack, risk framework, AI workforce routing |

All files are in: `E:\Layaa AI\Claude Plugins\claude-chat\project-knowledge\`

---

### Step 3: Add the 8 Meta-Skills
For each skill file:
1. Go to **Customize** (top left) → **Skills** → **+** (New skill)
2. Paste the full content of the `.md` file
3. Save

Add in this order (all files in `E:\Layaa AI\Claude Plugins\claude-chat\meta-skills\`):

| File | Skill Name | Skills Inside |
|------|-----------|--------------|
| `layaa-sales.md` | layaa-sales | 11 sales sub-skills |
| `layaa-marketing.md` | layaa-marketing | 9 marketing sub-skills |
| `layaa-brand.md` | layaa-brand | 3 brand sub-skills |
| `layaa-legal.md` | layaa-legal | 10 legal sub-skills |
| `layaa-finance.md` | layaa-finance | 8 finance sub-skills |
| `layaa-operations.md` | layaa-operations | 10 operations sub-skills |
| `layaa-product.md` | layaa-product | 7 product sub-skills |
| `layaa-core.md` | layaa-core | 2 Layaa-specific skills |

---

### Step 4: Test
Test each skill with a Layaa AI task and a non-Layaa task:
- "Use layaa-sales to draft outreach to a logistics company" → should apply Layaa context
- "Use layaa-brand to check this post for brand voice" → should apply tone framework
- "Run daily-update" → should run the check-in flow
- "Use layaa-sales to help me prep for a call with Acme Corp in the US" → should use general sales mode (no Layaa context)

---

## Claude Co-work — Setup Steps

### Step 1: Project Setup (same as Claude Chat)
Create the same project with the same instructions and upload the same 5 knowledge files.

### Step 2: Add the 8 Meta-Skills (same as Claude Chat)
Same 8 skills work in Co-work.

### Step 3: Set Up Scheduled Tasks

**Daily Update (Mon-Sat, 9:00 AM IST):**
1. Go to Co-work → **Scheduled** → **+ New Task**
2. Name: `Layaa Daily Check-in`
3. Paste the full content from: `co-work/scheduled-tasks/daily-update-task.md`
4. Schedule cron: `0 9 * * 1-6`

**Monthly Investor Update (28th of each month, 10:00 AM IST):**
1. Go to Co-work → **Scheduled** → **+ New Task**
2. Name: `Monthly Investor Update`
3. Paste the full content from: `co-work/scheduled-tasks/investor-update-task.md`
4. Schedule cron: `0 10 28 * *`

---

## Maintenance

### When to re-upload Project Knowledge
- Major pricing changes
- New service verticals or significant service changes
- New ICP segments added
- Team or org chart changes
- After significant KB updates in `E:\Layaa AI\Claude Plugins\layaa-ai\`
- After updates to `Projects/Layaa AI/Company ref docs/` (consolidated reference docs, 35 files, updated April 2026)

### When to update meta-skills
- New sub-skills added to the Claude Code plugin
- Significant changes to skill logic or brand voice

### Platform differences
| Feature | Claude Code | Claude Chat | Co-work |
|---------|-------------|-------------|---------|
| Grouping | 8 plugins in sidebar | 8 meta-skills in My Skills | 8 meta-skills in My Skills |
| Context loading | Reads files live from disk | Uses uploaded Project Knowledge | Uses uploaded Project Knowledge |
| Auto-updates | Always current | Re-upload when things change | Re-upload when things change |
| Scheduled tasks | Claude Code scheduler | Not available | Co-work scheduler |

### File locations
- Meta-skills: `E:\Layaa AI\Claude Plugins\claude-chat\meta-skills\`
- Project Knowledge: `E:\Layaa AI\Claude Plugins\claude-chat\project-knowledge\`
- Co-work tasks: `E:\Layaa AI\Claude Plugins\claude-chat\co-work\scheduled-tasks\`
