"use client";

import React from "react";
import { Column, Flex, Text, SmartLink, Icon } from "@/once-ui/components";

const items = [
  { href: "/me/service", label: "Mes services" },
  { href: "/me/article", label: "Mes articles" },
];

export default function MeQuickMenu() {
  return (
    <Column
      padding="8"
      gap="4"
      style={{ position: "sticky", top: "88px", minWidth: 260 }}
    >
      {items.map((item) => (
        <SmartLink key={item.href} href={item.href} unstyled>
          <Flex
            paddingY="12"
            paddingX="12"
            horizontal="space-between"
            vertical="center"
            radius="s"
            style={{ cursor: "pointer" }}
          >
            <Text variant="heading-strong-s">{item.label}</Text>
            <Icon name="chevronRight" onBackground="neutral-weak" />
          </Flex>
        </SmartLink>
      ))}
    </Column>
  );
}
