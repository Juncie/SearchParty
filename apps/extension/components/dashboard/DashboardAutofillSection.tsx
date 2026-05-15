import { Button } from "@/components/ui/button";
import { ScanSearch, Zap } from "lucide-react";

interface DashboardAutofillSectionProps {
  scanSummary: string;
  scanBusy: boolean;
  quickApplyBusy: boolean;
  fieldsDetected: boolean;
  hasQuickTargets: boolean;
  hasDefaultProfile: boolean;
  notice: string | null;
  error: string | null;
  onQuickApply: () => void;
  onPreviewMatches: () => void;
  /** Re-runs a full autofill scan on the active tab (same as Autofill workspace). */
  onScanTab: () => void;
}

export function DashboardAutofillSection({
  scanSummary,
  scanBusy,
  quickApplyBusy,
  fieldsDetected,
  hasQuickTargets,
  hasDefaultProfile,
  notice,
  error,
  onQuickApply,
  onPreviewMatches,
  onScanTab,
}: DashboardAutofillSectionProps) {
  const busy = scanBusy || quickApplyBusy;
  const canQuickApply =
    hasDefaultProfile &&
    fieldsDetected &&
    hasQuickTargets &&
    !busy;

  return (
    <section className="status-card">
      <div className="space-y-3">
        <div>
          <p className="island-kicker">Quick apply</p>
          <h2 className="text-base font-semibold text-balance">
            Fill confident matches on this page using your
            default profile
          </h2>
          <p className="panel-muted">
            Always review the matches before you submit.
          </p>
        </div>

        <div className="flex flex-col gap-2 @sm:flex-row @sm:flex-wrap @sm:items-center">
          {fieldsDetected ? (
            <>
              <Button
                type="button"
                className="w-full cursor-pointer @sm:w-auto @sm:min-w-44"
                disabled={!canQuickApply}
                onClick={() => void onQuickApply()}
              >
                <Zap className="size-4" />
                Quick apply
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer @sm:w-auto"
                disabled={busy}
                onClick={() => void onPreviewMatches()}
              >
                Preview Autofill
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full cursor-pointer @sm:w-auto"
              disabled={busy}
              onClick={() => void onScanTab()}
            >
              <ScanSearch className="mr-1 size-4" />
              {scanBusy ? "Scanning…" : "Scan active tab"}
            </Button>
          )}
        </div>

        <p className="text-xs/relaxed text-muted-foreground">
          {scanBusy
            ? "Checking the active tab…"
            : scanSummary}
        </p>

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
      </div>
    </section>
  );
}
