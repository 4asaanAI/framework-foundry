/**
 * Seed Script — Layaa OS
 *
 * Loads skills and company reference docs into the database.
 * Skills → skills table
 * Company docs → core_context table
 *
 * Run from the browser console or via a seed button in Settings.
 * Uses existing tables — no new tables created.
 */

import { supabase } from "@/integrations/supabase/client";

// ─── Skill Definitions (88 skills) ──────────────────────────────────────────

// These are loaded from the Claude Plugins/layaa-ai/skills/ directory at build time.
// Each skill has: name, description, category, trigger_keywords, agents.

const SKILL_DEFINITIONS: {
  name: string;
  description: string;
  category: string;
}[] = [
  // ── Original 61 Business Skills ──
  { name: "account-research", description: "Research a target account for sales preparation", category: "sales" },
  { name: "audit-support", description: "Support audit preparation and documentation", category: "finance" },
  { name: "brand-review", description: "Review content for brand voice consistency", category: "marketing" },
  { name: "call-prep", description: "Prepare for a sales or discovery call", category: "sales" },
  { name: "call-summary", description: "Summarize a completed call with action items", category: "sales" },
  { name: "campaign-plan", description: "Plan a marketing campaign end-to-end", category: "marketing" },
  { name: "capacity-plan", description: "Plan team capacity and resource allocation", category: "operations" },
  { name: "change-request", description: "Draft and manage a change request", category: "operations" },
  { name: "client-agreement", description: "Draft or review a client agreement", category: "legal" },
  { name: "client-onboarding", description: "Plan and execute client onboarding", category: "delivery" },
  { name: "close-management", description: "Manage a deal through closing stages", category: "sales" },
  { name: "competitive-brief", description: "Create a competitive intelligence brief", category: "marketing" },
  { name: "competitive-intelligence", description: "Gather and analyze competitive intelligence", category: "marketing" },
  { name: "compliance-check", description: "Run a compliance check on a process or document", category: "legal" },
  { name: "compliance-tracking", description: "Track regulatory compliance status", category: "legal" },
  { name: "content-creation", description: "Create content for marketing channels", category: "marketing" },
  { name: "create-an-asset", description: "Create a business asset (template, deck, doc)", category: "operations" },
  { name: "daily-briefing", description: "Start your day with a prioritized briefing", category: "operations" },
  { name: "daily-update", description: "Capture daily check-in updates", category: "operations" },
  { name: "discover-brand", description: "Discover and document a brand's identity", category: "marketing" },
  { name: "discovery-call", description: "Conduct a structured discovery call", category: "sales" },
  { name: "draft-content", description: "Draft content for any channel or format", category: "marketing" },
  { name: "draft-outreach", description: "Draft outreach messages for prospects", category: "sales" },
  { name: "email-sequence", description: "Design an email nurture sequence", category: "marketing" },
  { name: "enforce-voice", description: "Enforce brand voice guidelines on content", category: "marketing" },
  { name: "financial-statements", description: "Prepare or review financial statements", category: "finance" },
  { name: "forecast", description: "Build a revenue or pipeline forecast", category: "revenue-ops" },
  { name: "generate-guidelines", description: "Generate operational or brand guidelines", category: "operations" },
  { name: "investor-update", description: "Draft an investor or stakeholder update", category: "finance" },
  { name: "journal-entry", description: "Create an accounting journal entry", category: "finance" },
  { name: "journal-entry-prep", description: "Prepare supporting docs for journal entries", category: "finance" },
  { name: "legal-brief", description: "Draft a legal brief or memo", category: "legal" },
  { name: "legal-response", description: "Draft a response to a legal query or notice", category: "legal" },
  { name: "legal-risk-assessment", description: "Assess legal risk of a decision or contract", category: "legal" },
  { name: "meeting-briefing", description: "Prepare a briefing for an upcoming meeting", category: "operations" },
  { name: "metrics-review", description: "Review KPIs and performance metrics", category: "revenue-ops" },
  { name: "performance-report", description: "Generate a performance report", category: "revenue-ops" },
  { name: "pipeline-review", description: "Review and analyze the sales pipeline", category: "revenue-ops" },
  { name: "pm-competitive-brief", description: "Create a product-focused competitive brief", category: "product" },
  { name: "process-doc", description: "Document a business process or SOP", category: "operations" },
  { name: "process-optimization", description: "Optimize an existing business process", category: "operations" },
  { name: "proposal-generator", description: "Generate a client proposal", category: "sales" },
  { name: "reconciliation", description: "Perform account reconciliation", category: "finance" },
  { name: "review-contract", description: "Review a contract for risks and issues", category: "legal" },
  { name: "risk-assessment", description: "Assess business or operational risk", category: "operations" },
  { name: "roadmap-update", description: "Update the product roadmap", category: "product" },
  { name: "runbook", description: "Create an operational runbook", category: "operations" },
  { name: "seo-audit", description: "Audit a page or site for SEO quality", category: "marketing" },
  { name: "signature-request", description: "Prepare a document for e-signature", category: "legal" },
  { name: "social-media-calendar", description: "Plan a social media content calendar", category: "marketing" },
  { name: "sox-testing", description: "Conduct SOX compliance testing", category: "finance" },
  { name: "sprint-planning", description: "Plan a development sprint with stories and estimates", category: "product" },
  { name: "stakeholder-update", description: "Draft an update for stakeholders", category: "operations" },
  { name: "status-report", description: "Generate a project or department status report", category: "operations" },
  { name: "synthesize-research", description: "Synthesize research findings into actionable insights", category: "operations" },
  { name: "triage-nda", description: "Triage and review an NDA", category: "legal" },
  { name: "variance-analysis", description: "Analyze budget vs actual variance", category: "finance" },
  { name: "vendor-check", description: "Evaluate a vendor or supplier", category: "operations" },
  { name: "vendor-review", description: "Conduct a thorough vendor review", category: "operations" },
  { name: "write-spec", description: "Write a product or feature specification", category: "product" },

  // ── 27 New Engineering & Technical Skills ──
  { name: "code-review", description: "Perform a thorough code review — correctness, security, performance, readability", category: "engineering" },
  { name: "debug-issue", description: "Systematically debug a reported issue: reproduce, isolate, root cause, fix, verify", category: "engineering" },
  { name: "write-code", description: "Write production-quality code for a feature, function, or component", category: "engineering" },
  { name: "refactor-code", description: "Refactor existing code to improve structure without changing behavior", category: "engineering" },
  { name: "api-design", description: "Design a REST or edge function API endpoint with schemas and auth", category: "engineering" },
  { name: "db-schema", description: "Design or review database schema: tables, relationships, indexes, RLS", category: "engineering" },
  { name: "architecture-review", description: "Review system architecture for scalability, security, cost, and compliance", category: "engineering" },
  { name: "write-tests", description: "Write unit, integration, or E2E tests", category: "engineering" },
  { name: "security-audit", description: "Perform a security audit: OWASP Top 10, auth, data exposure, DPDP", category: "engineering" },
  { name: "performance-review", description: "Analyze and optimize code or system performance", category: "engineering" },
  { name: "deploy-checklist", description: "Generate a deployment checklist for a release", category: "engineering" },
  { name: "dependency-audit", description: "Audit dependencies for vulnerabilities, outdated packages, and license issues", category: "engineering" },
  { name: "ci-cd-setup", description: "Design or review CI/CD pipeline configuration", category: "engineering" },
  { name: "pr-review", description: "Review a pull request for quality, coverage, and alignment", category: "engineering" },
  { name: "tech-spec", description: "Write a technical specification document for a feature or system", category: "engineering" },
  { name: "incident-response", description: "Handle a production incident: triage, diagnose, fix, communicate, post-mortem", category: "engineering" },
  { name: "data-migration", description: "Plan and execute a data migration with validation and rollback", category: "engineering" },
  { name: "workflow-builder", description: "Design an n8n or automation workflow with triggers and error handling", category: "engineering" },
  { name: "integration-setup", description: "Set up a new integration with OAuth, API keys, and testing", category: "engineering" },
  { name: "qa-test-plan", description: "Create a comprehensive QA test plan", category: "engineering" },
  { name: "bug-report", description: "Write a structured bug report with reproduction steps", category: "engineering" },
  { name: "release-notes", description: "Generate release notes from recent changes", category: "product" },
  { name: "user-story", description: "Write a user story with acceptance criteria and estimation", category: "product" },
  { name: "backlog-groom", description: "Groom the product backlog: prioritize, estimate, identify dependencies", category: "product" },
  { name: "retrospective", description: "Facilitate a retrospective: what went well, what didn't, action items", category: "product" },
  { name: "client-handover", description: "Prepare a client handover package with docs, credentials, and transition plan", category: "delivery" },
  { name: "knowledge-base-update", description: "Update or create a knowledge base entry", category: "delivery" },
  { name: "training-material", description: "Create training materials: guides, FAQs, and video scripts", category: "delivery" },
];

// ─── Company Reference Doc Categories ───────────────────────────────────────

const COMPANY_DOC_CATEGORIES = [
  "00-Company-Identity",
  "01-Brand-Voice",
  "02-Marketing",
  "03-Sales",
  "04-Revenue-Ops",
  "05-Finance",
  "06-Legal",
  "07-Operations",
  "08-Technology",
  "09-Compliance-Environment",
  "10-Certifications-Government",
];

// ─── Seed Functions ─────────────────────────────────────────────────────────

/**
 * Seed all 88 skills into the skills table.
 * Skips skills that already exist (by name).
 */
export async function seedSkills(): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (const skill of SKILL_DEFINITIONS) {
    // Check if skill already exists
    const { data: existing } = await supabase
      .from("skills")
      .select("id")
      .eq("name", skill.name)
      .limit(1)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("skills").insert({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      is_active: true,
    } as any);

    if (error) {
      console.error(`[Seed] Failed to insert skill "${skill.name}":`, error.message);
      skipped++;
    } else {
      inserted++;
    }
  }

  return { inserted, skipped };
}

/**
 * Seed company reference docs into core_context table.
 * Each doc category becomes a core_context entry with context_key = category name.
 * Content is provided as parameter (read from files externally).
 */
export async function seedCompanyDoc(
  contextKey: string,
  content: string,
  agentId?: string
): Promise<boolean> {
  // Check if entry already exists
  const { data: existing } = await supabase
    .from("core_context")
    .select("id")
    .eq("context_key", contextKey)
    .limit(1)
    .maybeSingle();

  if (existing) {
    // Update existing entry
    const { error } = await supabase
      .from("core_context")
      .update({ content, version: 2 })
      .eq("context_key", contextKey);
    return !error;
  }

  // Insert new entry
  const { error } = await supabase.from("core_context").insert({
    context_key: contextKey,
    content,
    agent_id: agentId || null,
    version: 1,
  });

  return !error;
}

/**
 * Get all skill definitions (for UI display).
 */
export function getSkillDefinitions() {
  return SKILL_DEFINITIONS;
}
