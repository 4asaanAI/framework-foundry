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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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
          <span className="text-[10px] whitespace-nowrap opacity-60">
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
    return true;
  });

  // Stats
  const pending = enriched.filter((a) => a.status === "pending").length;
  const timedOutCount = enriched.filter((a) => a.timedOut).length;

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

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Status:
          </span>
        </div>
        {(["all", "pending", "approved", "rejected", "timeout"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          )
        )}

        <div className="w-px h-6 bg-border mx-1" />

        <span className="text-xs font-medium text-muted-foreground self-center">
          Tier:
        </span>
        {(["all", 1, 2, 3] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              tierFilter === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t === "all" ? "All" : `Tier ${t}`}
          </button>
        ))}
      </div>

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
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <TierBadge tier={item.tier} />
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
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reject(item.id)}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
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

              {/* Expanded Audit Trail */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Audit Trail
                  </p>
                  <AuditTrail approvalId={item.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
