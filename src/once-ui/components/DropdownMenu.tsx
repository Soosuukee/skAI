"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { Flex } from ".";
import { DropdownTrigger } from "./DropdownTrigger";
import { DropdownContent } from "./DropdownContent";

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open = false,
  onOpenChange,
  className,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onOpenChange]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Flex
      ref={dropdownRef}
      position="relative"
      className={className}
      style={style}
    >
      {React.Children.map(children, (child) => {
                 if (React.isValidElement(child)) {
           if (child.type === DropdownTrigger) {
             return React.cloneElement(child, {
               ...child.props,
               onClick: () => handleOpenChange(!isOpen),
             } as any);
           }
           if (child.type === DropdownContent && isOpen) {
             return React.cloneElement(child);
           }
         }
        return child;
      })}
    </Flex>
  );
};
