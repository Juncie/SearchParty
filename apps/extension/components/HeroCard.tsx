import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroCardProps {
  title: string;
  greeting: string;
  description?: string;
  action?: () => void;
  actionTitle?: string;
  actionIcon?: LucideIcon;
}

export function HeroCard({
  title,
  greeting,
  description,
  action,
  actionTitle,
  actionIcon: ActionIcon,
}: HeroCardProps) {
  return (
    <section className="hero-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="island-kicker">{title}</p>
          <h1 className="display-title">{greeting}</h1>
          {description ? (
            <p className="lede">{description}</p>
          ) : null}
        </div>
        {action && actionTitle && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={action}
          >
            {ActionIcon && (
              <ActionIcon className="size-4" />
            )}
            {actionTitle}
          </Button>
        )}
      </div>
    </section>
  );
}
