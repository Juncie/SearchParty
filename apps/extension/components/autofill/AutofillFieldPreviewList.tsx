import type {
  AutofillPayloadValues,
  ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { valueForAutofillKind } from "@searchparty/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { tierLabel } from "./autofill-display";

interface AutofillFieldPreviewListProps {
  fields: ScannedAutofillFieldPayload[];
  payload: AutofillPayloadValues;
  selected: Record<string, boolean>;
  onToggleField: (spId: string, checked: boolean) => void;
}

export function AutofillFieldPreviewList({
  fields,
  payload,
  selected,
  onToggleField,
}: AutofillFieldPreviewListProps) {
  return (
    <ul className="grid gap-2 text-xs">
      {fields.map((field) => {
        const value = valueForAutofillKind(payload, field.kind);
        const empty = value.trim().length === 0;
        return (
          <li
            key={field.spId}
            className="rounded-lg border border-border bg-card/60 p-2"
          >
            <div className="flex items-start gap-2">
              <Checkbox
                checked={Boolean(selected[field.spId])}
                onCheckedChange={(checked) =>
                  onToggleField(field.spId, checked === true)
                }
                className="mt-0.5"
                aria-label={`Apply ${field.labelPreview}`}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    {field.labelPreview}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                      field.tier === "auto" &&
                        "border-primary/40 bg-primary/10 text-primary",
                      field.tier === "suggest" &&
                        "border-border bg-muted text-muted-foreground",
                      field.tier === "confirm" &&
                        "border-destructive/40 bg-destructive/10 text-destructive",
                    )}
                  >
                    {tierLabel(field.tier)} · {field.score}%
                  </span>
                  <span className="text-muted-foreground">{field.kind}</span>
                </div>
                <p
                  className={cn(
                    "break-all text-[0.7rem]",
                    empty
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {empty
                    ? "No value in profile for this field."
                    : `→ ${value}`}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
