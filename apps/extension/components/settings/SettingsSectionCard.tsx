import type { ReactNode } from "react";

interface SettingsSectionCardProps {
  title: string;
  children: ReactNode;
}

export function SettingsSectionCard({
  title,
  children,
}: SettingsSectionCardProps) {
  return (
    <section className="status-card col-span-full">
      <h2>{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
