"use client";

import React, { ReactNode } from "react";

interface DropdownTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  children,
  asChild = false,
  onClick,
  className,
  style,
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick,
      className,
      style,
    } as any);
  }

  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
};
