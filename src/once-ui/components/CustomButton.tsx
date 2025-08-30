"use client";

import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";
import { Flex } from ".";

interface CustomButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "s" | "m" | "l";
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  label?: string;
  weight?: "default" | "strong";
  fillWidth?: boolean;
  children?: ReactNode;
}

const CustomButton = forwardRef<HTMLDivElement, CustomButtonProps>(
  (
    {
      variant = "secondary",
      size = "m",
      radius,
      label,
      weight = "strong",
      children,
      className,
      style,
      fillWidth = false,
      ...rest
    },
    ref
  ) => {
    const radiusSize = size === "s" || size === "m" ? "m" : "l";
    return (
      <div
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          radius === "none"
            ? "radius-none"
            : radius
            ? `radius-${radiusSize}-${radius}`
            : `radius-${radiusSize}`,
          "text-decoration-none",
          "button",
          "cursor-interactive",
          { ["fill-width"]: fillWidth, ["fit-width"]: !fillWidth },
          className
        )}
        style={style}
        role="button"
        tabIndex={0}
        {...rest}
      >
        {(label || children) && (
          <Flex
            paddingX="4"
            paddingY="0"
            textWeight={weight}
            textSize={size}
            className="font-label"
          >
            {label || children}
          </Flex>
        )}
      </div>
    );
  }
);

CustomButton.displayName = "CustomButton";
export { CustomButton };
