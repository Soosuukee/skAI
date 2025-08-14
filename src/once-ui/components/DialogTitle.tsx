"use client";

import React, { ReactNode } from "react";
import { Heading } from ".";

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <Heading
      id="dialog-title"
      variant="heading-strong-l"
      className={className}
      style={style}
    >
      {children}
    </Heading>
  );
};
