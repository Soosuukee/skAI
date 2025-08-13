"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { HomeHeader } from "./HomeHeader";
import { ProviderHeader } from "./ProviderHeader";

export const DynamicHeader = () => {
  const pathname = usePathname() ?? "";

  // Si on est sur la page d'accueil (/)
  if (pathname === "/") {
    return <HomeHeader />;
  }

  // Si on est sur une page provider (/providers/[slug]/*)
  if (pathname.startsWith("/providers/")) {
    return <ProviderHeader />;
  }

  // Pour toutes les autres pages, utiliser le header par défaut
  return <Header />;
};
