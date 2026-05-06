import type { ExtensionSurface } from "@/components/AppRouter";
import { SearchPartyPanel } from "@/components/SearchPartyPanel";

interface DashboardPageProps {
  surface: ExtensionSurface;
}

export function DashboardPage({ surface }: DashboardPageProps) {
  return <SearchPartyPanel surface={surface} />;
}
