import type {
  ApplicantProfile,
  AutofillPayloadValues,
  ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { Button } from "@/components/ui/button";
import type { AuthSession } from "@/lib/searchparty-api";
import { ScanSearch } from "lucide-react";

import { AutofillFieldPreviewList } from "./AutofillFieldPreviewList";

type AutofillWorkflowStatus =
  | "idle"
  | "loading"
  | "scanning"
  | "applying";

interface AutofillWorkspaceProps {
  busy: boolean;
  session: AuthSession | null;
  status: AutofillWorkflowStatus;
  activeProfile: ApplicantProfile | null;
  fields: ScannedAutofillFieldPayload[];
  payload: AutofillPayloadValues | null;
  selected: Record<string, boolean>;
  onToggleField: (spId: string, checked: boolean) => void;
  error: string | null;
  notice: string | null;
  onScan: () => void;
  onApply: () => void;
  /** Primary full-width apply control (profile detail view). */
  prominentApply?: boolean;
  /**
   * Mark {@link activeProfile} as the account default (e.g. profile edit).
   * Omit on routes where the workspace only reflects the server default (autofill tab).
   */
  onSetDefaultProfile?: () => void | Promise<void>;
  /** When true, disables the default-profile action while parent work is in flight. */
  setDefaultProfileDisabled?: boolean;
}

export function AutofillWorkspace({
  busy,
  session,
  status,
  activeProfile,
  fields,
  payload,
  selected,
  onToggleField,
  error,
  notice,
  onScan,
  onApply,
  prominentApply = false,
  onSetDefaultProfile,
  setDefaultProfileDisabled = false,
}: AutofillWorkspaceProps) {
  return (
    <section className="status-card">
      {prominentApply && (
        <Button
          type="button"
          size="xl"
          className="w-full cursor-pointer"
          disabled={busy || fields.length === 0 || !payload}
          onClick={() => void onApply()}
        >
          {status === "applying"
            ? "Applying…"
            : "Apply to this page"}
        </Button>
      )}
      {onSetDefaultProfile ? (
        <Button
          type="button"
          size="xl"
          variant="outline"
          className="w-full cursor-pointer"
          disabled={
            busy ||
            !session ||
            !activeProfile ||
            setDefaultProfileDisabled
          }
          onClick={() => void onSetDefaultProfile()}
        >
          Set Default Profile
        </Button>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy || !session}
          onClick={() => void onScan()}
        >
          <ScanSearch className="mr-1 size-4" />
          {status === "scanning"
            ? "Scanning…"
            : "Scan active tab"}
        </Button>
        {!prominentApply ? (
          <Button
            type="button"
            size="sm"
            disabled={
              busy || fields.length === 0 || !payload
            }
            onClick={() => void onApply()}
          >
            {status === "applying"
              ? "Applying…"
              : "Apply selected"}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            Re-scan after the page changes.
          </span>
        )}
      </div>

      {activeProfile ? (
        <p className="text-xs/relaxed text-muted-foreground">
          {prominentApply ? (
            <>
              Applying{" "}
              <span className="font-medium text-foreground">
                {activeProfile.name}
              </span>{" "}
              to the active tab. Pick another profile from
              the dashboard when needed.
            </>
          ) : (
            <>
              Using active profile{" "}
              <span className="font-medium text-foreground">
                {activeProfile.name}
              </span>
              . Set another on the dashboard if needed.
            </>
          )}
        </p>
      ) : (
        <p className="text-xs text-destructive">
          No active profile. Choose one on the dashboard
          before autofill.
        </p>
      )}

      {error ? (
        <p className="error-message text-destructive">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="text-xs/relaxed text-muted-foreground">
          {notice}
        </p>
      ) : null}

      {fields.length > 0 && payload ? (
        <AutofillFieldPreviewList
          fields={fields}
          payload={payload}
          selected={selected}
          onToggleField={onToggleField}
        />
      ) : null}
    </section>
  );
}
