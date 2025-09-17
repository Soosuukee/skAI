"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input, DropdownWrapper, Flex } from ".";
import { DatePicker } from "./DatePicker";
import type { Placement } from "@floating-ui/react-dom";

interface DateInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  id: string;
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  minHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  timePicker?: boolean;
  floatingPlacement?: Placement;
  monthYearSelector?: boolean;
}

const formatDate = (date: Date, timePicker: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(timePicker && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };

  return date.toLocaleString("en-US", options);
};

export const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  minHeight,
  className,
  style,
  timePicker = false,
  floatingPlacement = "right-start",
  monthYearSelector,
  minDate,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? formatDate(value, timePicker) : ""
  );

  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value, timePicker));
    }
  }, [value, timePicker]);

  const handleDateChange = useCallback(
    (date: Date) => {
      setInputValue(formatDate(date, timePicker));
      onChange?.(date);
    },
    [onChange, timePicker]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setInputValue(formatDate(date, timePicker));
      onChange?.(date);
      if (!timePicker) {
        setIsOpen(false);
      }
    },
    [onChange, timePicker]
  );

  const handleInputClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const trigger = (
    <Input
      className="cursor-interactive"
      style={{
        textOverflow: "ellipsis",
      }}
      id={id}
      label={label}
      value={inputValue}
      error={error}
      readOnly
      onClick={handleInputClick}
      {...rest}
    />
  );

  const dropdown = (
    <Flex
      padding="20"
      onClick={(e) => {
        // Empêcher la fermeture du dropdown quand on clique sur le DatePicker
        e.stopPropagation();
      }}
    >
      <DatePicker
        value={value}
        onChange={handleDateChange}
        onDateSelect={handleDateSelect}
        timePicker={timePicker}
        monthYearSelector={monthYearSelector}
        minDate={minDate}
      />
    </Flex>
  );

  return (
    <DropdownWrapper
      fillWidth
      floatingPlacement={floatingPlacement}
      trigger={trigger}
      minHeight={minHeight}
      dropdown={dropdown}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className={className}
      style={{ ...style }}
      closeAfterClick={false}
    />
  );
};
