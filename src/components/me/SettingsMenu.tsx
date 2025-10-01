"use client";

import React from "react";
import { Column, Flex, Text, SmartLink, Icon } from "@/once-ui/components";

const items: Array<{ id: string; label: string }> = [
  { id: "photo", label: "Photo" },
  { id: "profile", label: "Profil" },
  { id: "email", label: "Email" },
  { id: "password", label: "Mot de passe" },
  { id: "danger", label: "Danger" },
];

export default function SettingsMenu() {
  return (
    <Column
      padding="8"
      gap="4"
      style={{ position: "sticky", top: "88px", minWidth: 260 }}
    >
      {items.map((item) => (
        <SmartLink key={item.id} href={`#${item.id}`} unstyled>
          <Flex
            paddingY="12"
            paddingX="12"
            horizontal="space-between"
            vertical="center"
            radius="s"
            style={{ cursor: "pointer" }}
            className="settings-nav-item"
          >
            <Text variant="heading-strong-s">{item.label}</Text>
            <Icon name="chevronRight" onBackground="neutral-weak" />
          </Flex>
        </SmartLink>
      ))}
    </Column>
  );
}
