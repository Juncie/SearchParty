import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SettingBlockCardProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingBlockCard({
  title,
  description,
  children,
  className,
  ...props
}: SettingBlockCardProps) {
  return (
    <section className={cn("status-card", className)}>
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        {description != null && description !== "" ? (
          typeof description === "string" ? (
            <p className="panel-muted mt-1">
              {description}
            </p>
          ) : (
            <div className="mt-1">{description}</div>
          )
        ) : null}
      </div>
      {children}
    </section>
  );
}
