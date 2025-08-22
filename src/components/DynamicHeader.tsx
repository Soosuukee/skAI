"use client";

import { Header } from "./Header";
import { ProviderHeader } from "./ProviderHeader";
import { useNavigationContext } from "@/app/hooks/useNavigationContext";

type DynamicHeaderProps = {
  showLogo?: boolean;
};

export const DynamicHeader = ({ showLogo = true }: DynamicHeaderProps) => {
  const navigationContext = useNavigationContext();

  if (navigationContext === "provider") {
    return <ProviderHeader showLogo={showLogo} />;
  }

  return <Header showLogo={showLogo} />;
};
