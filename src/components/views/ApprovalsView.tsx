// src/components/views/ApprovalsView.tsx — FULL REPLACEMENT
// Enhanced with Tier 1/2/3 system, timeout countdown, audit trail, filters

import { useState } from "react";
import { useApprovals } from "@/hooks/use-approvals";
import {
  useApprovalWorkflow,
  useApprovalCountdown,
} from "@/hooks/use-approval-workflow";
import {
  classifyTier,
  getTierLabel,
  getTierColor,
  getAuditLog,
  isTimedOut,
  type ApprovalTier,
} from "@/lib/approvals";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  MessageCircle,
  Forward,
  CheckSquare,
  Square,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ClarificationDialog } from "@/components/dialogs/ClarificationDialog";

// ─── Filter Types ────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "timeout";
type TierFilter = "all" | 1 | 2 | 3;

// ─── Countdown Component ─────────────────────────────────────────────────────

function CountdownBadge({ createdAt }: { createdAt: string }) {
  const { formatted, isExpired } = useApprovalCountdown(createdAt);

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
        <AlertTriangle className="w-3 h-3" />
        Timed out
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
      <Clock className="w-3 h-3" />
      {formatted}
    </span>
  );
}

// ─── Tier Badge ───────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: ApprovalTier }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        getTierColor(tier)
      )}
    >
      {getTierLabel(tier)}
    </span>
  );
}

// ─── Audit Trail Panel ───────────────────────────────────────────────────────

function AuditTrail({ approvalId }: { approvalId: string }) {
  const entries = getAuditLog(approvalId);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        No audit entries yet.
      </p>
    );
  }

  return (
    <div className="space-y-1 py-2">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex items-start gap-2 text-xs text-muted-foreground"
        >
          <span className="text-xs whitespace-nowrap opacity-60">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
          <span className="font-medium text-foreground/70">{entry.action}</span>
          <span>{entry.details}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function ApprovalsView() {
  const { data: dbApprovals, isLoading } = useApprovals();
  const { approve, reject } = useApprovalWorkflow();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clarifyApprovalId, setClarifyApprovalId] = useState<string | null>(null);
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Action type filter
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  // SLA stats toggle
  const [showSLA, setShowSLA] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const approvals = dbApprovals ?? [];

  // Enrich with tier classification
  const enriched = approvals.map((item) => ({
    ...item,
    tier: classifyTier(item.action_type ?? ""),
    timedOut: item.status === "pending" && isTimedOut(item.created_at),
  }));

  // Apply filters
  const filtered = enriched.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (tierFilter !== "all" && item.tier !== tierFilter) return false;
    if (actionTypeFilter !== "all" && item.action_type !== actionTypeFilter) return false;
    return true;
  });

  // Stats
  const pending = enriched.filter((a) => a.status === "pending").length;
  const timedOutCount = enriched.filter((a) => a.timedOut).length;

  // Unique action types for filter
  const actionTypes = [...new Set(enriched.map(a => a.action_type).filter(Boolean))];

  // SLA metrics
  const resolvedApprovals = enriched.filter(a => a.status === "approved" || a.status === "rejected");
  const avgResolutionMs = resolvedApprovals.length > 0
    ? resolvedApprovals.reduce((sum, a) => {
        const created = new Date(a.created_at).getTime();
        const resolved = new Date(a.updated_at || a.created_at).getTime();
        return sum + (resolved - created);
      }, 0) / resolvedApprovals.length
    : 0;
  const avgResolutionMin = Math.round(avgResolutionMs / 60000);

  // Bulk operations
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllPending = () => {
    const pendingIds = filtered.filter(a => a.status === "pending" && !a.timedOut).map(a => a.id);
    setSelectedIds(new Set(pendingIds));
  };

  const handleBulkApprove = () => {
    selectedIds.forEach(id => approve(id));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    selectedIds.forEach(id => reject(id));
    setSelectedIds(new Set());
  };

  // Forward approval to another profile
  const handleForward = async (approvalId: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      // Get all profiles
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
      const { user } = await import("@/contexts/AuthContext").then(m => m.useAuth ? { user: null } : { user: null });
      // Find the other profile (not current user)
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      const otherProfile = (profiles ?? []).find((p: any) => p.user_id !== currentUserId);
      if (!otherProfile) return;
      await supabase.from("approvals").update({ profile_id: otherProfile.user_id }).eq("id", approvalId);
      await supabase.from("notifications").insert({
        profile_id: otherProfile.user_id,
        title: "Approval forwarded to you",
        body: "An approval has been forwarded to you for review.",
        category: "approval",
      });
      const { toast } = await import("sonner");
      toast.success(`Forwarded to ${otherProfile.display_name || "other founder"}`);
    } catch { /* ignore */ }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approval Queue</h1>
          <p className="text-sm text-muted-foreground">
            {pending} pending · {timedOutCount} timed out · {enriched.length}{" "}
            total
          </p>
        </div>
      </div>

      {/* SLA Metrics Bar */}
      {showSLA && (
        <div className="flex gap-4 p-3 rounded-xl bg-card border border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Avg Resolution</p>
            <p className="text-lg font-bold font-mono">{avgResolutionMin}m</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Approval Rate</p>
            <p className="text-lg font-bold font-mono">{resolvedApprovals.length > 0 ? Math.round(resolvedApprovals.filter(a => a.status === "approved").length / resolvedApprovals.length * 100) : 0}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Resolved</p>
            <p className="text-lg font-bold font-mono">{resolvedApprovals.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Timed Out</p>
            <p className="text-lg font-bold font-mono text-destructive">{timedOutCount}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
        </div>
        {(["all", "pending", "approved", "rejected", "timeout"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all duration-200", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />
        <span className="text-xs font-medium text-muted-foreground">Tier:</span>
        {(["all", 1, 2, 3] as const).map((t) => (
          <button key={t} onClick={() => setTierFilter(t)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all duration-200", tierFilter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {t === "all" ? "All" : `Tier ${t}`}
          </button>
        ))}

        {actionTypes.length > 0 && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            <span className="text-xs font-medium text-muted-foreground">Type:</span>
            <select value={actionTypeFilter} onChange={e => setActionTypeFilter(e.target.value)}
              className="px-2 py-1 rounded-lg border border-border bg-card text-xs">
              <option value="all">All Types</option>
              {actionTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </>
        )}

        <div className="ml-auto flex gap-1">
          <button onClick={() => setShowSLA(!showSLA)}
            className={cn("p-1.5 rounded-lg transition-all duration-200", showSLA ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}
            title="Toggle SLA metrics">
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <span className="text-xs font-medium text-foreground">{selectedIds.size} selected</span>
          <button onClick={handleBulkApprove} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium hover:bg-emerald-500/20 transition-all duration-200">Approve All</button>
          <button onClick={handleBulkReject} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-all duration-200">Reject All</button>
          <button onClick={() => setSelectedIds(new Set())} className="text-xs text-muted-foreground hover:text-foreground ml-auto transition-all duration-200">Clear</button>
        </div>
      )}
      {selectedIds.size === 0 && pending > 1 && (
        <button onClick={selectAllPending} className="text-xs text-muted-foreground hover:text-foreground transition-all duration-200">
          Select all pending ({pending})
        </button>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No approvals match your filters.</p>
        </div>
      )}

      {/* Approval Cards */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const timeAgo = (() => {
            try {
              return formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              });
            } catch {
              return "";
            }
          })();

          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border p-4 transition-all",
                item.status === "pending" && !item.timedOut
                  ? "bg-card border-border shadow-sm"
                  : item.timedOut
                  ? "bg-destructive/5 border-destructive/20"
                  : "bg-muted/30 border-border/50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Bulk selection checkbox */}
                {item.status === "pending" && !item.timedOut && (
                  <button onClick={() => toggleSelect(item.id)} className="mt-1 shrink-0">
                    {selectedIds.has(item.id)
                      ? <CheckSquare className="w-4 h-4 text-primary" />
                      : <Square className="w-4 h-4 text-muted-foreground hover:text-foreground transition-all duration-200" />}
                  </button>
                )}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <TierBadge tier={item.tier} />
                    {item.action_type === "escalation" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        ESCALATION
                      </span>
                    )}
                    {item.status === "pending" && !item.timedOut && (
                      <CountdownBadge createdAt={item.created_at} />
                    )}
                    {item.timedOut && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        <AlertTriangle className="w-3 h-3" />
                        Timed out — Escalated
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm font-medium text-foreground">
                    {item.action_description}
                  </p>

                  {/* Meta */}
                  <p className="text-xs text-muted-foreground">
                    Requested by{" "}
                    <span className="font-medium">
                      {(item as Record<string, unknown>).agent_name as string ??
                        "Unknown"}
                    </span>{" "}
                    · {item.action_type} · {timeAgo}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.status === "pending" && !item.timedOut && (
                    <>
                      <button
                        onClick={() => approve(item.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all duration-200"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reject(item.id)}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleForward(item.id)}
                        className="p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200"
                        title="Forward to other founder"
                      >
                        <Forward className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {item.status === "approved" && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approved
                    </span>
                  )}
                  {item.status === "rejected" && (
                    <span className="text-xs font-medium text-destructive flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Rejected
                    </span>
                  )}

                  {/* Expand audit trail */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    title="Audit trail"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Audit Trail + Clarification Thread */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Audit Trail
                  </p>
                  <AuditTrail approvalId={item.id} />

                  {/* Clarification Thread */}
                  {(() => {
                    const msgs = (item as any).approval_messages;
                    const threadMsgs = Array.isArray(msgs) ? msgs : [];
                    return threadMsgs.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Clarification Thread</p>
                        {threadMsgs.map((m: any, mi: number) => (
                          <div key={mi} className={cn(
                            "px-3 py-2 rounded-lg text-xs",
                            m.role === "approver"
                              ? "bg-primary/10 text-foreground ml-4"
                              : "bg-muted text-foreground mr-4"
                          )}>
                            <span className="font-semibold text-xs uppercase text-muted-foreground">
                              {m.role === "approver" ? "You" : "Agent"}
                            </span>
                            <p className="mt-0.5">{m.content}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(m.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* Ask Clarification button */}
                  {item.status === "pending" && (
                    <button
                      onClick={() => setClarifyApprovalId(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-all duration-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Ask Clarification
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clarification Dialog */}
      {clarifyApprovalId && (
        <ClarificationDialog
          open={!!clarifyApprovalId}
          onOpenChange={(open) => { if (!open) setClarifyApprovalId(null); }}
          approvalId={clarifyApprovalId}
        />
      )}
    </div>
  );
}
