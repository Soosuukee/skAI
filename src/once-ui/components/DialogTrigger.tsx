"use client";

import React, { ReactNode } from "react";

interface DialogTriggerProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  className,
  style,
}) => {
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
};
