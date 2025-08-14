"use client";

import React, { ReactNode } from "react";
import { Flex } from ".";

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className,
  style,
}) => {
  return (
    <Flex
      paddingX="12"
      paddingY="8"
      radius="s"
      cursor="pointer"
      onClick={onClick}
      className={className}
      style={{
        ...style,
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--neutral-weak)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "";
      }}
    >
      {children}
    </Flex>
  );
};
