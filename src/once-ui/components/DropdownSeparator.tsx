"use client";

import React from "react";
import { Flex } from ".";

interface DropdownSeparatorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownSeparator: React.FC<DropdownSeparatorProps> = ({
  className,
  style,
}) => {
  return (
    <Flex
      background="neutral-medium"
      marginY="4"
      className={className}
      style={{
        ...style,
        height: "1px",
      }}
    />
  );
};
