"use client";

import React, { ReactNode } from "react";
import { Flex } from ".";

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <Flex
      as="header"
      direction="column"
      paddingX="24"
      paddingTop="24"
      paddingBottom="s"
      gap="4"
      className={className}
      style={style}
    >
      {children}
    </Flex>
  );
};
