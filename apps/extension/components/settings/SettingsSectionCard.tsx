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
    <section className="col-span-full grid gap-2">
    <h2 className="font-[550] uppercase tracking-wider ">{title.toUpperCase()}</h2>
    <div className="grid gap-3">{children}</div>
  </section>
  );
}
