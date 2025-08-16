"use client";

import React from "react";
import { Button } from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "s" | "m" | "l";
  className?: string;
}

export function JoinButton({
  variant = "primary",
  size = "m",
  className,
}: JoinButtonProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Ne pas afficher le bouton si l'utilisateur est connecté ou si on est en cours de chargement
  if (isLoading || user) {
    return null;
  }

  const handleClick = () => {
    router.push("/join");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      Nous rejoindre
    </Button>
  );
}
