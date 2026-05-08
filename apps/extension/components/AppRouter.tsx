import type { ExtensionSurface } from "@/components/extension-surface";
import { SearchPartyPanel } from "@/components/SearchPartyPanel";

interface AppRouterProps {
  surface: ExtensionSurface;
}

export function AppRouter({ surface }: AppRouterProps) {
  return <SearchPartyPanel surface={surface} />;
}
