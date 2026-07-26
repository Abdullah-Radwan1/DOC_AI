/**
 * ChatResponseRenderer
 *
 * Inspects an assistant reply and renders it conversationally.
 *
 * If the reply is plain text → renders it as-is (newline-aware).
 * If the reply is a JSON object matching the AiAnalysisResponse shape →
 *   each populated section is rendered with a natural-language intro and a
 *   clean, readable list.
 *
 * This file is purely presentational. It has zero coupling to the analysis
 * page, the backend services, or any state outside the chat pipeline.
 */

import React from "react";
import { cn } from "@/lib/utils";

// ── Lightweight frontend-local types (mirror backend AiAnalysisResponse) ─────

type ImportantDate = {
  label: string;
  date: string;
  pageNumber?: number | null;
};

type ContractParty = {
  name: string;
  role?: string;
  type?: string;
  address?: string | null;
  signatory?: string | null;
};

type ContractObligation = {
  party?: string;
  obligation: string;
  deadline?: string | null;
  frequency?: string | null;
  clauseReference?: string | null;
  pageNumber?: number | null;
};

type PaymentTerm = {
  description: string;
  amount?: string | null;
  currency?: string | null;
  frequency?: string | null;
  dueDate?: string | null;
  latePenalty?: string | null;
  clauseReference?: string | null;
  pageNumber?: number | null;
};

type ContractPenalty = {
  type?: string;
  penalty: string;
  trigger?: string;
  clauseReference?: string | null;
  pageNumber?: number | null;
};

type RenewalTerm = {
  type?: string;
  period?: string | null;
  noticePeriod?: string | null;
  clauseReference?: string | null;
  pageNumber?: number | null;
};

type TerminationTerms = {
  terminationNotice?: string | null;
  terminationConditions?: string[];
};

type MissingClause = {
  name: string;
  importance?: string;
  reason?: string;
};

type ComplianceRequirement = {
  requirement: string;
  status: "met" | "partial" | "unmet" | "unknown";
  reason?: string;
  evidence?: string | null;
  pageNumber?: number | null;
  clauseReference?: string | null;
  confidence?: number;
  recommendation?: string | null;
};

type Finding = {
  title: string;
  description?: string | null;
  severity?: string;
  category?: string;
  excerpt?: string | null;
  clauseReference?: string | null;
  pageNumber?: number | null;
  recommendation?: string | null;
};

type StructuredResponse = {
  summary?: string;
  contract?: {
    expirationDate?: string | null;
    parties?: ContractParty[];
    obligations?: ContractObligation[];
    paymentTerms?: PaymentTerm[];
    penalties?: ContractPenalty[];
    renewalTerms?: RenewalTerm[];
    terminationTerms?: TerminationTerms;
    governingLaw?: string | null;
    importantDates?: ImportantDate[];
    missingClauses?: MissingClause[];
  };
  compliance?: {
    overallVerdict?: string;
    riskLevel?: string;
    confidence?: number;
    summary?: { passed: number; failed: number; partial: number; unknown: number };
    requirements?: ComplianceRequirement[];
    findings?: Finding[];
  };
};

// ── Parser ────────────────────────────────────────────────────────────────────

function tryParseStructured(content: string): StructuredResponse | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || Array.isArray(parsed)) return null;
    // Must have at least one of the known top-level keys
    if (!parsed.contract && !parsed.compliance && !parsed.summary) return null;
    return parsed as StructuredResponse;
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasItems(arr?: unknown[]): arr is NonNullable<typeof arr> {
  return Array.isArray(arr) && arr.length > 0;
}

function capFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// ── Micro atoms ───────────────────────────────────────────────────────────────

function Ref({ page, clause }: { page?: number | null; clause?: string | null }) {
  const parts: string[] = [];
  if (clause) parts.push(clause);
  if (page != null) parts.push(`p.${page}`);
  if (!parts.length) return null;
  return (
    <span className="ml-1.5 text-[10px] text-muted-foreground font-mono">
      [{parts.join(" · ")}]
    </span>
  );
}

function Evidence({ text }: { text: string }) {
  return (
    <p className="mt-1.5 pl-3 border-l-2 border-border text-[11px] text-muted-foreground italic leading-snug">
      "{text}"
    </p>
  );
}

function Recommendation({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">
      💡 {text}
    </p>
  );
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-snug mb-2">{children}</p>;
}

function BulletList({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5">{children}</ul>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-1.5 text-sm leading-snug">
      <span className="mt-[3px] text-muted-foreground text-[10px] shrink-0">•</span>
      <span>{children}</span>
    </li>
  );
}

function Divider() {
  return <div className="my-3 border-t border-border/50" />;
}

const STATUS_CONFIG = {
  met:     { label: "Satisfied",          color: "text-emerald-700 bg-emerald-50 border-emerald-200",     icon: "✓" },
  partial: { label: "Partially satisfied", color: "text-amber-700 bg-amber-50 border-amber-200",         icon: "~" },
  unmet:   { label: "Not satisfied",      color: "text-red-700 bg-red-50 border-red-200",                icon: "✗" },
  unknown: { label: "Unknown",            color: "text-muted-foreground bg-muted border-border",         icon: "?" },
} as const;

function StatusBadge({ status }: { status: ComplianceRequirement["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border",
        cfg.color,
      )}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-700 bg-red-50 border-red-200",
  high:     "text-orange-700 bg-orange-50 border-orange-200",
  medium:   "text-amber-700 bg-amber-50 border-amber-200",
  low:      "text-sky-700 bg-sky-50 border-sky-200",
  info:     "text-muted-foreground bg-muted border-border",
};

function SeverityBadge({ severity }: { severity?: string }) {
  const s = (severity ?? "info").toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded border uppercase tracking-wide",
        SEVERITY_COLOR[s] ?? SEVERITY_COLOR.info,
      )}
    >
      {s}
    </span>
  );
}

// ── Section renderers ─────────────────────────────────────────────────────────

function ImportantDatesSection({ dates }: { dates: ImportantDate[] }) {
  return (
    <div>
      <SectionIntro>Here are the important dates found in this document:</SectionIntro>
      <BulletList>
        {dates.map((d, i) => (
          <Bullet key={i}>
            <span>
              <span className="font-medium">{d.label}</span>
              {" — "}
              {d.date}
              <Ref page={d.pageNumber} />
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function PartiesSection({ parties }: { parties: ContractParty[] }) {
  return (
    <div>
      <SectionIntro>This contract involves the following parties:</SectionIntro>
      <BulletList>
        {parties.map((p, i) => (
          <Bullet key={i}>
            <span>
              <span className="font-medium">{p.name}</span>
              {p.role && (
                <span className="text-muted-foreground"> ({capFirst(p.role)})</span>
              )}
              {p.type && p.type !== "unknown" && (
                <span className="text-muted-foreground text-[11px]"> · {p.type}</span>
              )}
              {p.signatory && (
                <span className="text-muted-foreground text-[11px]">
                  {" "}— signed by {p.signatory}
                </span>
              )}
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function ObligationsSection({ obligations }: { obligations: ContractObligation[] }) {
  // Group by party when multiple parties are present
  const byParty: Record<string, ContractObligation[]> = {};
  for (const o of obligations) {
    const key = o.party || "General";
    (byParty[key] ??= []).push(o);
  }
  const groups = Object.entries(byParty);

  return (
    <div>
      <SectionIntro>The document defines the following obligations:</SectionIntro>
      {groups.length === 1 ? (
        <BulletList>
          {obligations.map((o, i) => (
            <Bullet key={i}>
              <span>
                {o.obligation}
                {o.deadline && (
                  <span className="text-muted-foreground"> (by {o.deadline})</span>
                )}
                <Ref page={o.pageNumber} clause={o.clauseReference} />
              </span>
            </Bullet>
          ))}
        </BulletList>
      ) : (
        <div className="space-y-2.5">
          {groups.map(([party, items]) => (
            <div key={party}>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {party}
              </p>
              <BulletList>
                {items.map((o, i) => (
                  <Bullet key={i}>
                    <span>
                      {o.obligation}
                      {o.deadline && (
                        <span className="text-muted-foreground"> (by {o.deadline})</span>
                      )}
                      <Ref page={o.pageNumber} clause={o.clauseReference} />
                    </span>
                  </Bullet>
                ))}
              </BulletList>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentTermsSection({ terms }: { terms: PaymentTerm[] }) {
  return (
    <div>
      <SectionIntro>Here are the payment terms outlined in this document:</SectionIntro>
      <BulletList>
        {terms.map((t, i) => (
          <Bullet key={i}>
            <span>
              {t.description}
              {(t.amount || t.currency) && (
                <span className="font-medium">
                  {" "}— {[t.amount, t.currency].filter(Boolean).join(" ")}
                </span>
              )}
              {t.frequency && (
                <span className="text-muted-foreground"> ({t.frequency})</span>
              )}
              {t.dueDate && (
                <span className="text-muted-foreground"> · due {t.dueDate}</span>
              )}
              <Ref page={t.pageNumber} clause={t.clauseReference} />
              {t.latePenalty && (
                <span className="block text-[11px] text-muted-foreground mt-0.5">
                  Late penalty: {t.latePenalty}
                </span>
              )}
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function PenaltiesSection({ penalties }: { penalties: ContractPenalty[] }) {
  return (
    <div>
      <SectionIntro>The contract includes the following penalties:</SectionIntro>
      <BulletList>
        {penalties.map((p, i) => (
          <Bullet key={i}>
            <span>
              {p.type && (
                <span className="font-medium">[{capFirst(p.type)}] </span>
              )}
              {p.penalty}
              {p.trigger && (
                <span className="text-muted-foreground"> — triggered by: {p.trigger}</span>
              )}
              <Ref page={p.pageNumber} clause={p.clauseReference} />
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function RenewalSection({ terms }: { terms: RenewalTerm[] }) {
  return (
    <div>
      <SectionIntro>Renewal terms:</SectionIntro>
      <BulletList>
        {terms.map((r, i) => (
          <Bullet key={i}>
            <span>
              {r.type && <span className="font-medium">{capFirst(r.type)}</span>}
              {r.period && <span> — {r.period}</span>}
              {r.noticePeriod && (
                <span className="text-muted-foreground"> (notice required: {r.noticePeriod})</span>
              )}
              <Ref clause={r.clauseReference} />
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function TerminationSection({ terms }: { terms: TerminationTerms }) {
  const hasNotice = !!terms.terminationNotice;
  const hasConditions = hasItems(terms.terminationConditions);
  if (!hasNotice && !hasConditions) return null;

  return (
    <div>
      <SectionIntro>Termination conditions:</SectionIntro>
      <BulletList>
        {hasNotice && (
          <Bullet>
            <span>
              <span className="font-medium">Notice required:</span>{" "}
              {terms.terminationNotice}
            </span>
          </Bullet>
        )}
        {hasConditions &&
          terms.terminationConditions!.map((c, i) => (
            <Bullet key={i}>
              <span>{c}</span>
            </Bullet>
          ))}
      </BulletList>
    </div>
  );
}

function MissingClausesSection({ clauses }: { clauses: MissingClause[] }) {
  return (
    <div>
      <SectionIntro>
        The following clauses appear to be missing from this contract:
      </SectionIntro>
      <BulletList>
        {clauses.map((c, i) => (
          <Bullet key={i}>
            <span>
              {c.importance && (
                <span className="font-medium text-[10px] uppercase tracking-wide text-muted-foreground">
                  [{c.importance}]{" "}
                </span>
              )}
              <span className="font-medium">{c.name}</span>
              {c.reason && (
                <span className="text-muted-foreground"> — {c.reason}</span>
              )}
            </span>
          </Bullet>
        ))}
      </BulletList>
    </div>
  );
}

function GoverningLawSection({ law }: { law: string }) {
  return (
    <p className="text-sm">
      The contract is governed by the laws of{" "}
      <span className="font-medium">{law}</span>.
    </p>
  );
}

function ExpirationDateSection({ date }: { date: string }) {
  return (
    <p className="text-sm">
      This contract expires on{" "}
      <span className="font-medium">{date}</span>.
    </p>
  );
}

// ── Compliance renderers ──────────────────────────────────────────────────────

const VERDICT_SENTENCE: Record<string, string> = {
  compliant:     "The document fully satisfies the stated compliance requirements.",
  partial:       "The document partially satisfies the stated compliance requirements.",
  non_compliant: "The document does not satisfy one or more of the stated compliance requirements.",
  unknown:       "It was not possible to determine whether the document satisfies all compliance requirements.",
};

function ComplianceRequirementsSection({
  requirements,
  overallVerdict,
}: {
  requirements: ComplianceRequirement[];
  overallVerdict?: string;
}) {
  const isSingle = requirements.length === 1;

  if (isSingle) {
    const req = requirements[0];
    return (
      <div className="space-y-2">
        {/* Natural verdict sentence */}
        <p className="text-sm leading-snug">
          {overallVerdict
            ? VERDICT_SENTENCE[overallVerdict] ?? VERDICT_SENTENCE.unknown
            : req.status === "met"
              ? "The document satisfies your request."
              : req.status === "partial"
                ? "The document partially satisfies your request."
                : req.status === "unmet"
                  ? "The document does not satisfy your request."
                  : "I was unable to determine whether the document satisfies your request."}
        </p>

        <StatusBadge status={req.status} />

        {req.reason && (
          <p className="text-sm text-muted-foreground leading-snug mt-1">
            {req.reason}
          </p>
        )}
        {req.evidence && <Evidence text={req.evidence} />}
        {req.recommendation && <Recommendation text={req.recommendation} />}
        <Ref page={req.pageNumber} clause={req.clauseReference} />
      </div>
    );
  }

  // Multiple requirements
  return (
    <div className="space-y-3">
      {overallVerdict && (
        <p className="text-sm leading-snug">
          {VERDICT_SENTENCE[overallVerdict] ?? VERDICT_SENTENCE.unknown}
        </p>
      )}

      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        Requirement breakdown
      </p>

      <div className="space-y-3">
        {requirements.map((req, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-start gap-2">
              <StatusBadge status={req.status} />
              <p className="text-sm leading-snug font-medium">{req.requirement}</p>
            </div>
            {req.reason && (
              <p className="text-[12px] text-muted-foreground leading-snug pl-1">
                {req.reason}
              </p>
            )}
            {req.evidence && <Evidence text={req.evidence} />}
            {req.recommendation && <Recommendation text={req.recommendation} />}
            <Ref page={req.pageNumber} clause={req.clauseReference} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FindingsSection({ findings }: { findings: Finding[] }) {
  return (
    <div>
      <SectionIntro>
        {findings.length === 1
          ? "I identified the following finding:"
          : `I identified ${findings.length} findings in this document:`}
      </SectionIntro>
      <div className="space-y-2.5">
        {findings.map((f, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <SeverityBadge severity={f.severity} />
              <span className="text-sm font-medium">{f.title}</span>
            </div>
            {f.description && (
              <p className="text-[12px] text-muted-foreground leading-snug">
                {f.description}
              </p>
            )}
            {f.excerpt && <Evidence text={f.excerpt} />}
            {f.recommendation && <Recommendation text={f.recommendation} />}
            <Ref page={f.pageNumber} clause={f.clauseReference} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Structured response orchestrator ─────────────────────────────────────────

function StructuredReply({ data }: { data: StructuredResponse }) {
  const ct = data.contract;
  const cp = data.compliance;

  // Build the ordered list of sections to render
  const sections: React.ReactNode[] = [];

  // ── Compliance first (highest priority) ──────────────────────────────────
  if (hasItems(cp?.requirements)) {
    sections.push(
      <ComplianceRequirementsSection
        key="compliance-reqs"
        requirements={cp!.requirements!}
        overallVerdict={cp?.overallVerdict}
      />,
    );
  }

  if (hasItems(cp?.findings)) {
    sections.push(<FindingsSection key="findings" findings={cp!.findings!} />);
  }

  // ── Contract data ─────────────────────────────────────────────────────────
  if (hasItems(ct?.importantDates)) {
    sections.push(
      <ImportantDatesSection key="dates" dates={ct!.importantDates!} />,
    );
  }

  if (ct?.expirationDate) {
    sections.push(
      <ExpirationDateSection key="expiry" date={ct.expirationDate} />,
    );
  }

  if (hasItems(ct?.parties)) {
    sections.push(<PartiesSection key="parties" parties={ct!.parties!} />);
  }

  if (hasItems(ct?.obligations)) {
    sections.push(
      <ObligationsSection key="obligations" obligations={ct!.obligations!} />,
    );
  }

  if (hasItems(ct?.paymentTerms)) {
    sections.push(
      <PaymentTermsSection key="payments" terms={ct!.paymentTerms!} />,
    );
  }

  if (hasItems(ct?.penalties)) {
    sections.push(<PenaltiesSection key="penalties" penalties={ct!.penalties!} />);
  }

  if (hasItems(ct?.renewalTerms)) {
    sections.push(<RenewalSection key="renewal" terms={ct!.renewalTerms!} />);
  }

  if (
    ct?.terminationTerms &&
    (ct.terminationTerms.terminationNotice ||
      hasItems(ct.terminationTerms.terminationConditions))
  ) {
    sections.push(
      <TerminationSection key="termination" terms={ct.terminationTerms} />,
    );
  }

  if (ct?.governingLaw) {
    sections.push(<GoverningLawSection key="law" law={ct.governingLaw} />);
  }

  if (hasItems(ct?.missingClauses)) {
    sections.push(
      <MissingClausesSection key="missing" clauses={ct!.missingClauses!} />,
    );
  }

  // ── Fallback to summary if no sections rendered ───────────────────────────
  if (sections.length === 0 && data.summary) {
    return <PlainTextContent content={data.summary} />;
  }

  // ── Interleave with dividers ──────────────────────────────────────────────
  return (
    <div>
      {sections.map((section, i) => (
        <div key={i}>
          {section}
          {i < sections.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
}

// ── Plain text fallback ───────────────────────────────────────────────────────

function PlainTextContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <span className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for the raw `MessageContent` component.
 *
 * Pass an assistant message's `content` string here.
 * - If it is valid JSON matching the analysis response shape → renders conversationally.
 * - Otherwise → renders as plain text (exactly as before).
 *
 * Never renders raw JSON to the user.
 */
export function ChatResponseRenderer({ content }: { content: string }) {
  const structured = tryParseStructured(content);
  if (structured) return <StructuredReply data={structured} />;
  return <PlainTextContent content={content} />;
}
