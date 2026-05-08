import type { ReactNode } from "react";

interface SettingBlockCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingBlockCard({
  title,
  description,
  children,
}: SettingBlockCardProps) {
  return (
    <section className="status-card">
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        {description ? (
          <p className="panel-muted mt-1">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
