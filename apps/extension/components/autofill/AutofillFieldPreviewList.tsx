import { useEffect, useMemo, useState } from "react";

import type {
  AutofillFieldExecutionResult,
  AutofillPayloadValues,
  ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { valueForAutofillKind } from "@searchparty/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

import {
  groupAutofillPreviewFields,
  tierLabel,
  type AutofillPreviewConfidenceGroup,
} from "./autofill-display";

interface AutofillFieldPreviewListProps {
  fields: ScannedAutofillFieldPayload[];
  payload: AutofillPayloadValues;
  selected: Record<string, boolean>;
  applyResults: Record<string, AutofillFieldExecutionResult>;
  onToggleField: (spId: string, checked: boolean) => void;
}

const GROUP_ORDER: AutofillPreviewConfidenceGroup[] = [
  "auto",
  "caution",
  "warning",
];

const GROUP_LABEL: Record<AutofillPreviewConfidenceGroup, string> = {
  auto: "Auto",
  caution: "Caution",
  warning: "Warning / Error",
};

/** Pill colors: success (auto), caution, danger — tokens in `theme.css`. */
const GROUP_LABEL_BADGE_CLASS: Record<
  AutofillPreviewConfidenceGroup,
  string
> = {
  auto: "border-sp-status-success/35 bg-sp-status-success-muted text-sp-status-success",
  caution:
    "border-sp-status-caution/40 bg-sp-status-caution-muted text-sp-status-caution",
  warning:
    "border-sp-status-danger/35 bg-sp-status-danger-muted text-sp-status-danger",
};

const GROUP_DESCRIPTION: Record<AutofillPreviewConfidenceGroup, string> = {
  auto: "High-confidence matches with profile data — ready to fill.",
  caution: "Suggested matches — review before applying.",
  warning:
    "Needs confirmation, profile data, or cannot be filled automatically.",
};

function autofillTierChipClassName(
  tier: ScannedAutofillFieldPayload["tier"],
): string {
  switch (tier) {
    case "auto":
      return "border-[color:var(--autofill-tier-auto-border)] bg-[color:var(--autofill-tier-auto-bg)] text-[color:var(--autofill-tier-auto-fg)]";
    case "suggest":
      return "border-[color:var(--autofill-tier-suggest-border)] bg-[color:var(--autofill-tier-suggest-bg)] text-[color:var(--autofill-tier-suggest-fg)]";
    case "confirm":
      return "border-[color:var(--autofill-tier-confirm-border)] bg-[color:var(--autofill-tier-confirm-bg)] text-[color:var(--autofill-tier-confirm-fg)]";
    case "ignore":
      return "border-[color:var(--autofill-tier-ignore-border)] bg-[color:var(--autofill-tier-ignore-bg)] text-[color:var(--autofill-tier-ignore-fg)]";
  }
}

function buildInitialOpenMap(
  grouped: Record<
    AutofillPreviewConfidenceGroup,
    ScannedAutofillFieldPayload[]
  >,
): Partial<Record<AutofillPreviewConfidenceGroup, boolean>> {
  const firstWithItems = GROUP_ORDER.find(
    (k) => grouped[k].length > 0,
  );
  const next: Partial<
    Record<AutofillPreviewConfidenceGroup, boolean>
  > = {};
  for (const k of GROUP_ORDER) {
    if (grouped[k].length > 0) {
      next[k] = k === firstWithItems;
    }
  }
  return next;
}

function AutofillFieldPreviewRow({
  field,
  payload,
  selected,
  applyResults,
  onToggleField,
}: {
  field: ScannedAutofillFieldPayload;
  payload: AutofillPayloadValues;
  selected: Record<string, boolean>;
  applyResults: Record<string, AutofillFieldExecutionResult>;
  onToggleField: (spId: string, checked: boolean) => void;
}) {
  const value = valueForAutofillKind(payload, field.kind);
  const empty = value.trim().length === 0;
  const result = applyResults[field.spId];
  const disabled = field.fillStatus !== "fillable" || empty;
  const emptyValueHint =
    field.kind === "resume" && field.interactionType === "file"
      ? "No server-ready résumé on your account. File autofill uses SearchParty-stored uploads (not the profile wizard file metadata alone)."
      : field.kind === "resume"
        ? "No résumé value in the autofill payload for this field."
        : "No value in profile for this field.";
  const statusText = result
    ? result.ok
      ? "Verified"
      : (result.reason ?? "Needs review")
    : field.fillStatus === "manual"
      ? (field.unsupportedReason ?? "Manual review")
      : field.fillStatus === "unsupported"
        ? (field.unsupportedReason ?? "Unsupported")
        : empty
          ? emptyValueHint
          : `${field.interactionType} fill ready`;

  const applyFailed = Boolean(result && !result.ok);
  const showFilledValue =
    field.fillStatus === "fillable" && !empty && !applyFailed;

  const detailLine = applyFailed
    ? statusText
    : showFilledValue
      ? `→ ${value}`
      : statusText;

  const technicalHint = `${field.kind} · ${field.interactionType}`;

  return (
    <li
      className="rounded-lg border border-border bg-card/60 px-2.5 py-2"
      title={technicalHint}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={Boolean(selected[field.spId])}
          disabled={disabled}
          onCheckedChange={(checked) =>
            onToggleField(field.spId, checked === true)
          }
          className="mt-0.5 shrink-0"
          aria-label={`Apply ${field.labelPreview}`}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="min-w-0 font-medium leading-snug text-foreground">
              {field.labelPreview}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tabular-nums tracking-normal whitespace-nowrap",
                autofillTierChipClassName(field.tier),
              )}
            >
              {field.score}% Confident
            </span>
          </div>
          <p
            className={cn(
              "min-w-0 text-[0.7rem] leading-relaxed",
              applyFailed
                ? "line-clamp-2 text-destructive"
                : cn(
                    "text-muted-foreground",
                    showFilledValue ? "truncate" : "line-clamp-2",
                  ),
            )}
          >
            {detailLine}
          </p>
        </div>
      </div>
    </li>
  );
}

export function AutofillFieldPreviewList({
  fields,
  payload,
  selected,
  applyResults,
  onToggleField,
}: AutofillFieldPreviewListProps) {
  const grouped = useMemo(
    () =>
      groupAutofillPreviewFields(fields, (f) =>
        valueForAutofillKind(payload, f.kind),
      ),
    [fields, payload],
  );

  const scanSignature = useMemo(
   () =>
      GROUP_ORDER.map(
        (k) =>
          `${k}:${grouped[k].length}:${grouped[k].map((f) => f.spId).join(",")}`,
      ).join("|"),
    [grouped],
  );

  const [sectionOpen, setSectionOpen] = useState<
    Partial<Record<AutofillPreviewConfidenceGroup, boolean>>
  >(() => buildInitialOpenMap(grouped));

  useEffect(() => {
    setSectionOpen(buildInitialOpenMap(grouped));
  }, [scanSignature]);

  return (
    <div className="grid gap-2 text-xs">
      {GROUP_ORDER.map((groupKey) => {
        const bucket = grouped[groupKey];
        if (bucket.length === 0) {
          return null;
        }
        const isOpen = sectionOpen[groupKey] ?? false;
        const panelId = `autofill-preview-${groupKey}`;
        return (
          <div
            key={groupKey}
            className="rounded-lg border border-border bg-card/40"
          >
            <button
              type="button"
              id={`${panelId}-trigger`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={`${GROUP_LABEL[groupKey]}, ${bucket.length} field${bucket.length === 1 ? "" : "s"}. ${GROUP_DESCRIPTION[groupKey]}`}
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-left font-medium text-foreground transition-colors hover:bg-accent/40"
              onClick={() => {
                setSectionOpen((prev) => ({
                  ...prev,
                  [groupKey]: !(prev[groupKey] ?? false),
                }));
              }}
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                      GROUP_LABEL_BADGE_CLASS[groupKey],
                    )}
                  >
                    <span>{GROUP_LABEL[groupKey]}</span>
                    <span className="tabular-nums opacity-90">
                      ({bucket.length})
                    </span>
                  </span>
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "-rotate-180",
                )}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <ul
                id={panelId}
                className="grid gap-1.5 border-t border-border px-2 pb-2 pt-2"
                role="list"
              >
                {bucket.map((field) => (
                  <AutofillFieldPreviewRow
                    key={field.spId}
                    field={field}
                    payload={payload}
                    selected={selected}
                    applyResults={applyResults}
                    onToggleField={onToggleField}
                  />
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
