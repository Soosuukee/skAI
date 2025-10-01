"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Column, Heading, Button } from "@/once-ui/components";

export function MeMenu() {
  const pathname = usePathname() || "/me";

  let items: { label: string; href: string; active?: boolean }[] = [];

  if (pathname.startsWith("/me/service")) {
    items = [
      { label: "Mon profil", href: "/me" },
      { label: "Mes articles", href: "/me/article" },
    ];
  } else if (pathname.startsWith("/me/article")) {
    items = [
      { label: "Mon profil", href: "/me" },
      { label: "Mes services", href: "/me/service" },
    ];
  } else {
    items = [
      { label: "Mes services", href: "/me/service" },
      { label: "Mes articles", href: "/me/article" },
    ];
  }

  return (
    <Column gap="m" minWidth="160" paddingRight="16">
      <Heading as="h3" variant="display-strong-xs">
        Mon espace
      </Heading>
      <Column gap="8">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              href={item.href}
              variant={isActive ? "primary" : "secondary"}
              size="m"
            >
              {item.label}
            </Button>
          );
        })}
      </Column>
    </Column>
  );
}
