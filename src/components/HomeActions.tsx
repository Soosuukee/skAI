"use client";
import React from "react";
import { SmartLink } from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";

export function HomeActions() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <SmartLink
      href="/me"
      style={{
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        background: "transparent",
        border: "1px solid var(--brand)",
        textDecoration: "none",
        color: "var(--brand)",
        fontWeight: "600",
        fontSize: "1rem",
      }}
    >
      Modifier mes informations
    </SmartLink>
  );
}
