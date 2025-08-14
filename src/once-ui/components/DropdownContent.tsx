"use client";

import React, { ReactNode } from "react";
import { Flex } from ".";

interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <Flex
      direction="column"
      background="surface"
      border="neutral-medium"
      radius="m"
      shadow="l"
      padding="s"
      gap="2"
      className={className}
      style={style}
    >
      {children}
    </Flex>
  );
};
