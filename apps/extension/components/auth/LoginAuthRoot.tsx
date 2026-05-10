import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface LoginAuthRootProps {
  isSidePanel: boolean;
  phase: "loading" | "ready";
  children: ReactNode;
}

export function LoginAuthRoot({
  isSidePanel,
  phase,
  children,
}: LoginAuthRootProps) {
  return (
    <div
      className={cn(
        "auth-layout-root",
        isSidePanel &&
          (phase === "loading"
            ? "justify-center py-10"
            : "justify-center"),
      )}
    >
      {children}
    </div>
  );
}
