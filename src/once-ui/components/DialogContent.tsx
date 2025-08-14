"use client";

import React, { ReactNode } from "react";
import { Flex } from ".";

interface DialogContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <Flex
      as="section"
      paddingX="24"
      paddingBottom="24"
      flex={1}
      overflowY="auto"
      direction="column"
      className={className}
      style={style}
    >
      {children}
    </Flex>
  );
};
