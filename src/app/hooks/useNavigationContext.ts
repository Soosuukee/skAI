import { usePathname } from "next/navigation";

export type NavigationContext = "global" | "provider";

export function useNavigationContext(): NavigationContext {
  const pathname = usePathname();

  // Vérifier si nous sommes sur une page de provider
  const isProviderPage = pathname?.startsWith("/providers/") && 
    (pathname.includes("/about") || 
     pathname.includes("/service") || 
     pathname.includes("/blog") ||
     pathname.match(/^\/providers\/[^\/]+$/)); // Page principale du provider

  return isProviderPage ? "provider" : "global";
}

export function useProviderSlug(): string | null {
  const pathname = usePathname();
  
  if (!pathname?.startsWith("/providers/")) {
    return null;
  }

  // Extraire le slug du provider depuis l'URL
  const match = pathname.match(/^\/providers\/([^\/]+)/);
  return match ? match[1] : null;
}
