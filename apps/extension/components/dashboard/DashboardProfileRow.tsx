import type { ApplicantProfile } from "@searchparty/shared";
import {
  buildAutofillPayloadValues,
  valueForAutofillKind,
  type AutofillPayloadValues,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { Button } from "@/components/ui/button";
import { quickApplyFields } from "@/components/autofill/autofill-display";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import type { AuthSession } from "@/lib/searchparty-api";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent,
} from "react";

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, Math.max(0, max - 1))}…`;
}

export interface DashboardProfileRowProps {
  profile: ApplicantProfile;
  session: AuthSession | null;
  isDefault: boolean;
  scanFields: ScannedAutofillFieldPayload[];
  defaultResume: {
    id: string;
    label: string;
    mimeType: string;
  } | null;
  accountOnboardingAnswers?: Record<string, unknown>;
  /** When true, this row’s profile actions menu is open (controlled by the parent list). */
  actionsMenuOpen: boolean;
  onActionsMenuOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onApply: () => void | Promise<void>;
  applyBusy: boolean;
  onSetDefault: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

export function DashboardProfileRow({
  profile,
  session,
  isDefault,
  scanFields,
  defaultResume,
  accountOnboardingAnswers = {},
  actionsMenuOpen,
  onActionsMenuOpenChange,
  onEdit,
  onApply,
  applyBusy,
  onSetDefault,
  onDelete,
}: DashboardProfileRowProps) {
  const actionsMenuId = useId();
  const actionsRootRef = useRef<HTMLDivElement>(null);
  const onActionsMenuOpenChangeRef = useRef(
    onActionsMenuOpenChange
  );
  onActionsMenuOpenChangeRef.current =
    onActionsMenuOpenChange;

  useEffect(() => {
    if (!actionsMenuOpen) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (
        actionsRootRef.current?.contains(
          event.target as Node
        )
      ) {
        return;
      }
      onActionsMenuOpenChangeRef.current(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onActionsMenuOpenChangeRef.current(false);
      }
    };
    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true
    );
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true
      );
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [actionsMenuOpen]);

  const payload: AutofillPayloadValues | null =
    session?.user
      ? buildAutofillPayloadValues({
          user: {
            name: session.user.name,
            email: session.user.email,
          },
          profile,
          accountOnboardingAnswers,
          resumeAttachment: defaultResume
            ? { label: defaultResume.label }
            : undefined,
        })
      : null;

  const filledQuickCount =
    payload && scanFields.length > 0
      ? quickApplyFields(scanFields).filter((f) => {
          if (
            f.kind === "resume" &&
            f.interactionType === "file" &&
            defaultResume
          ) {
            return true;
          }
          return (
            valueForAutofillKind(payload, f.kind).trim()
              .length > 0
          );
        }).length
      : 0;

  const metaParts: string[] = [];
  if (scanFields.length > 0 && payload) {
    metaParts.push(
      `${filledQuickCount}/${quickApplyFields(scanFields).length} quick values`
    );
  } else if (scanFields.length > 0) {
    metaParts.push(
      `${quickApplyFields(scanFields).length} quick fields`
    );
  }

  const summaryLine =
    profile.summary.trim().length > 0
      ? truncate(profile.summary, 72)
      : truncate(profile.targetRole, 72);

  const handleRowActivate = useCallback(() => {
    void onEdit();
  }, [onEdit]);

  const stopRowNavigation = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card/70 px-2 py-2 transition-colors @container/row",
        "hover:bg-card",
        isDefault && "ring-1 ring-primary/50"
      )}
    >
      <button
        type="button"
        className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-start gap-2 rounded-md text-left outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
        onClick={() => void handleRowActivate()}
      >
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Briefcase className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {profile.name}
            </span>
            {isDefault ? (
              <span className="status-badge connected shrink-0">
                Default
              </span>
            ) : null}
          </span>
          <span className="block truncate text-xs/relaxed text-muted-foreground">
            {summaryLine}
          </span>
          {metaParts.length > 0 ? (
            <span className="block text-[0.65rem] text-muted-foreground">
              {metaParts.join(" · ")}
            </span>
          ) : null}
        </span>
      </button>

      <Button
        type="button"
        size="xs"
        variant="secondary"
        className="shrink-0 cursor-pointer"
        disabled={
          applyBusy ||
          scanFields.length === 0 ||
          !payload ||
          quickApplyFields(scanFields).length === 0
        }
        onClick={(event) => {
          event.stopPropagation();
          void onApply();
        }}
      >
        Apply
      </Button>

      <div
        ref={actionsRootRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          className={cn(
            "flex size-8 cursor-pointer items-center justify-center rounded-md border border-transparent text-muted-foreground outline-none transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:ring-1 focus-visible:ring-ring/40"
          )}
          aria-label="Profile actions"
          aria-haspopup="menu"
          aria-expanded={actionsMenuOpen}
          aria-controls={
            actionsMenuOpen ? actionsMenuId : undefined
          }
          onClick={(event) => {
            stopRowNavigation(event);
            onActionsMenuOpenChange(!actionsMenuOpen);
          }}
        >
          <MoreVertical className="size-4" aria-hidden />
        </button>
        {actionsMenuOpen ? (
          <div
            id={actionsMenuId}
            role="menu"
            className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-md ring-1 ring-foreground/10"
            onClick={stopRowNavigation}
          >
            <button
              type="button"
              role="menuitem"
              disabled={isDefault}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors",
                isDefault
                  ? "cursor-not-allowed text-muted-foreground"
                  : "cursor-pointer text-foreground hover:bg-muted"
              )}
              onClick={() => {
                onActionsMenuOpenChange(false);
                void onSetDefault();
              }}
            >
              <Star
                className={cn(
                  "size-3.5 shrink-0",
                  isDefault
                    ? "fill-primary text-primary"
                    : "fill-transparent"
                )}
                aria-hidden
              />
              {isDefault
                ? "Default profile"
                : "Set as default"}
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
              onClick={() => {
                onActionsMenuOpenChange(false);
                void onEdit();
              }}
            >
              <Pencil className="size-3.5 shrink-0" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10"
              onClick={() => {
                onActionsMenuOpenChange(false);
                void onDelete();
              }}
            >
              <Trash2 className="size-3.5 shrink-0" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
