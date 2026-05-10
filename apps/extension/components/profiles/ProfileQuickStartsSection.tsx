import type { ProfileDraft } from "@/components/profiles/ProfileEditor";
import { profileQuickStarts } from "@/lib/profile-quick-starts";

interface ProfileQuickStartsSectionProps {
  onSelectTemplate: (template: ProfileDraft) => void;
}

export function ProfileQuickStartsSection({
  onSelectTemplate,
}: ProfileQuickStartsSectionProps) {
  return (
    <section className="status-card">
      <div>
        <p className="island-kicker">Quick starts</p>
        <h2>Choose a starting point</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {profileQuickStarts.map((quickStart) => (
          <button
            key={quickStart.id}
            type="button"
            className="rounded-xl border border-border bg-card/70 p-3 text-left transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={() => onSelectTemplate(quickStart.profile)}
          >
            <span className="font-semibold">{quickStart.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {quickStart.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
