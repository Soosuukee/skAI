"use client";

import React, { useState, forwardRef, useEffect } from "react";
import classNames from "classnames";
import { Flex } from "./Flex";
import { Text } from "./Text";
import { Button } from "./Button";
import { Grid } from "./Grid";
import { SegmentedControl } from "./SegmentedControl";
import { IconButton } from "./IconButton";
import { RevealFx } from "./RevealFx";
import { NumberInput } from "./NumberInput";
import styles from "./DatePicker.module.scss";

export interface DatePickerProps
  extends Omit<React.ComponentProps<typeof Flex>, "onChange"> {
  value?: Date;
  onChange?: (date: Date) => void;
  onDateSelect?: (date: Date) => void; // Callback appelé seulement quand une date est vraiment sélectionnée
  minDate?: Date;
  maxDate?: Date;
  range?: {
    startDate?: Date;
    endDate?: Date;
  };
  timePicker?: boolean;
  /**
   * When true, show month and year dropdowns together in the header
   * so the user can change both without toggling the month/year views.
   */
  monthYearSelector?: boolean;
  size?: "s" | "m" | "l";
  className?: string;
  style?: React.CSSProperties;
  /** Show or hide next/previous month navigation */
  nextMonth?: boolean;
  previousMonth?: boolean;
  /** Controlled month/year and external month change handler */
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (direction: number) => void;
  onHover?: (date: Date | null) => void;
}

type ViewMode = "days" | "months" | "years";

const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      onDateSelect,
      minDate,
      maxDate,
      range,
      timePicker = false,
      monthYearSelector = false,
      size = "m",
      className,
      style,
      nextMonth = true,
      previousMonth = true,
      currentMonth: currentMonthProp,
      currentYear: currentYearProp,
      onMonthChange,
      onHover,
      ...rest
    },
    ref
  ) => {
    const today = new Date();
    const defaultTime = value
      ? { hours: value.getHours(), minutes: value.getMinutes() }
      : undefined;
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value || null
    );
    const [selectedTime, setSelectedTime] = useState<
      { hours: number; minutes: number } | undefined
    >(defaultTime);
    const [isPM, setIsPM] = useState(
      defaultTime?.hours ? defaultTime.hours >= 12 : false
    );
    const [isTimeSelector, setIsTimeSelector] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("days");

    const [currentMonth, setCurrentMonth] = useState<number>(
      typeof currentMonthProp === "number"
        ? currentMonthProp
        : value
        ? value.getMonth()
        : today.getMonth()
    );
    const [currentYear, setCurrentYear] = useState<number>(
      typeof currentYearProp === "number"
        ? currentYearProp
        : value
        ? value.getFullYear()
        : today.getFullYear()
    );

    // For years view - show range of 12 years
    const [yearRangeStart, setYearRangeStart] = useState<number>(
      Math.floor(currentYear / 12) * 12
    );

    useEffect(() => {
      if (value) {
        setSelectedDate(value);
        // only update internal month/year if external props not provided
        if (typeof currentMonthProp !== "number")
          setCurrentMonth(value.getMonth());
        if (typeof currentYearProp !== "number")
          setCurrentYear(value.getFullYear());
        setYearRangeStart(Math.floor(value.getFullYear() / 12) * 12);
      }
    }, [value]);

    // sync controlled month/year props
    useEffect(() => {
      if (typeof currentMonthProp === "number")
        setCurrentMonth(currentMonthProp);
    }, [currentMonthProp]);

    useEffect(() => {
      if (typeof currentYearProp === "number") setCurrentYear(currentYearProp);
    }, [currentYearProp]);

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      if (onChange) {
        onChange(date);
      }
      // onDateSelect est appelé seulement quand on clique sur un jour spécifique
      if (onDateSelect) {
        onDateSelect(date);
      }
    };

    const handleMonthChange = (direction: number) => {
      // If parent provided handler, call it instead of updating internal state
      if (onMonthChange) {
        onMonthChange(direction);
        return;
      }

      const newMonth = currentMonth + direction;
      if (newMonth < 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else if (newMonth > 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(newMonth);
      }
    };

    const handleYearChange = (direction: number) => {
      setCurrentYear(currentYear + direction);
    };

    const handleYearRangeChange = (direction: number) => {
      setYearRangeStart(yearRangeStart + direction * 12);
    };

    const handleMonthSelect = (month: number) => {
      console.log("handleMonthSelect called with month:", month);
      setCurrentMonth(month);
      setViewMode("days");
      setIsTransitioning(true);
    };

    const handleYearSelect = (year: number) => {
      console.log("handleYearSelect called with year:", year);
      setCurrentYear(year);
      setViewMode("months");
      setIsTransitioning(true);
    };

    const handleTimeToggle = (show: boolean) => {
      setIsTimeSelector(show);
      setIsTransitioning(true);
    };

    const handleViewModeToggle = (mode: ViewMode) => {
      setViewMode(mode);
      setIsTransitioning(true);
    };

    // New handlers for month/year dropdowns
    const handleMonthChangeDirect = (month: number) => {
      setCurrentMonth(month);
      setIsTransitioning(true);
    };

    const handleYearChangeDirect = (year: number) => {
      setCurrentYear(year);
      setIsTransitioning(true);
    };

    const handleTimeChange = (
      hours: number,
      minutes: number,
      pm: boolean = isPM
    ) => {
      if (!selectedDate) return;

      const newHours = pm ? (hours % 12) + 12 : hours % 12;
      const newTime = { hours: newHours, minutes };
      setSelectedTime(newTime);
      setIsPM(pm);

      const newDate = new Date(selectedDate);
      newDate.setHours(newHours, minutes);
      setSelectedDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
    };

    const convert24to12 = (hour: number) => {
      return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    };

    const isInRange = (date: Date) => {
      if (!range?.startDate || !range?.endDate) return false;
      return date >= range.startDate && date <= range.endDate;
    };

    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
      const firstDay = new Date(year, month, 1).getDay();
      // Convert Sunday (0) to 6, Monday (1) to 0, etc.
      return firstDay === 0 ? 6 : firstDay - 1;
    };

    const renderDaysView = () => {
      const daysInMonth = getDaysInMonth(currentMonth, currentYear);
      const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
      const days = [];

      // Previous month days
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

      for (let i = 0; i < firstDayOfMonth; i++) {
        const prevMonthDay = daysInPrevMonth - firstDayOfMonth + i + 1;
        days.push(
          <Flex
            key={`prev-${currentYear}-${currentMonth}-${i}`}
            fillWidth
            horizontal="center"
          >
            <Button
              fillWidth
              weight="default"
              variant="tertiary"
              size="m"
              type="button"
              disabled
            >
              {prevMonthDay}
            </Button>
          </Flex>
        );
      }

      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(currentYear, currentMonth, i);
        const isSelected =
          (selectedDate &&
            selectedDate.getDate() === i &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear) ||
          (value instanceof Date &&
            value.getTime() === currentDate.getTime()) ||
          range?.startDate?.getTime() === currentDate.getTime() ||
          range?.endDate?.getTime() === currentDate.getTime();

        const isFirstInRange =
          range?.startDate &&
          currentDate.getTime() === range.startDate.getTime();
        const isLastInRange =
          range?.endDate && currentDate.getTime() === range.endDate.getTime();

        // Check if the current date is out of the minDate and maxDate range
        const isDisabled =
          (minDate && currentDate < minDate) ||
          (maxDate && currentDate > maxDate);

        days.push(
          <Flex
            key={`current-${currentYear}-${currentMonth}-${i}`}
            fillWidth
            horizontal="center"
          >
            <Button
              fillWidth
              weight="default"
              variant={isSelected ? "primary" : "tertiary"}
              size="m"
              type="button"
              disabled={isDisabled}
              onClick={() => handleDateSelect(currentDate)}
              style={{ width: "40px", height: "40px" }}
            >
              {i}
            </Button>
          </Flex>
        );
      }

      // Next month days
      const remainingDays = 42 - days.length; // 6 rows * 7 days
      for (let i = 1; i <= remainingDays; i++) {
        days.push(
          <Flex
            key={`next-${currentYear}-${currentMonth}-${i}`}
            fillWidth
            horizontal="center"
          >
            <Button
              fillWidth
              weight="default"
              variant="tertiary"
              size="m"
              type="button"
              disabled
            >
              {i}
            </Button>
          </Flex>
        );
      }

      return days;
    };

    const renderMonthsView = () => {
      return monthNames.map((monthName, index) => {
        const isSelected = currentMonth === index;
        const isDisabled =
          (minDate && currentYear < minDate.getFullYear()) ||
          (maxDate && currentYear > maxDate.getFullYear()) ||
          (minDate &&
            currentYear === minDate.getFullYear() &&
            index < minDate.getMonth()) ||
          (maxDate &&
            currentYear === maxDate.getFullYear() &&
            index > maxDate.getMonth());

        return (
          <Flex key={`month-${index}`} fillWidth horizontal="center">
            <Button
              fillWidth
              weight="default"
              variant={isSelected ? "primary" : "tertiary"}
              size="m"
              type="button"
              disabled={isDisabled}
              onClick={() => handleMonthSelect(index)}
            >
              {monthName}
            </Button>
          </Flex>
        );
      });
    };

    const renderYearsView = () => {
      const years = [];
      for (let i = 0; i < 12; i++) {
        const year = yearRangeStart + i;
        const isSelected = currentYear === year;
        const isDisabled =
          (minDate && year < minDate.getFullYear()) ||
          (maxDate && year > maxDate.getFullYear());

        years.push(
          <Flex key={`year-${year}`} fillWidth horizontal="center">
            <Button
              fillWidth
              weight="default"
              variant={isSelected ? "primary" : "tertiary"}
              size="m"
              type="button"
              disabled={isDisabled}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </Button>
          </Flex>
        );
      }
      return years;
    };

    const renderHeader = () => {
      if (isTimeSelector) {
        return (
          <Flex horizontal="center" fillWidth direction="column" gap="8">
            <Text
              variant={`label-default-${size}`}
              onBackground="neutral-strong"
            >
              {monthNames[currentMonth]} {currentYear}
            </Text>
            <Text
              className="cursor-interactive"
              variant="label-default-s"
              onBackground="brand-weak"
              onClick={() => handleTimeToggle(false)}
            >
              Back to calendar
            </Text>
          </Flex>
        );
      }

      if (viewMode === "days") {
        return (
          <>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronLeft"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleMonthChange(-1);
              }}
            />
            <Flex fillWidth direction="column" horizontal="center" gap="8">
              <Flex
                vertical="center"
                gap="8"
                className={styles.calendar + " " + styles.monthYearSelect}
              >
                {monthYearSelector ? (
                  <>
                    <select
                      value={currentMonth}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleMonthChangeDirect(Number(e.target.value));
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label="Select month"
                    >
                      {monthNames.map((m, i) => (
                        <option key={m} value={i}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={currentYear}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleYearChangeDirect(Number(e.target.value));
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label="Select year"
                    >
                      {Array.from({ length: 40 }).map((_, i) => {
                        const year = new Date().getFullYear() - 20 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  <>
                    <Text
                      variant={`body-default-${size}`}
                      onBackground="neutral-strong"
                      className="cursor-interactive"
                      onClick={(event: any) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleViewModeToggle("months");
                      }}
                    >
                      {monthNames[currentMonth]}
                    </Text>
                    <Text
                      variant={`body-default-${size}`}
                      onBackground="neutral-strong"
                      className="cursor-interactive"
                      onClick={(event: any) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleViewModeToggle("years");
                      }}
                    >
                      {currentYear}
                    </Text>
                  </>
                )}
              </Flex>
              {timePicker && selectedTime && (
                <Text variant="label-default-s" onBackground="neutral-weak">
                  {`${selectedTime.hours
                    .toString()
                    .padStart(2, "0")}:${selectedTime.minutes
                    .toString()
                    .padStart(2, "0")} ${isPM ? "PM" : "AM"}`}
                </Text>
              )}
            </Flex>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronRight"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleMonthChange(1);
              }}
            />
          </>
        );
      }

      if (viewMode === "months") {
        return (
          <>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronLeft"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleYearChange(-1);
              }}
            />
            <Flex fillWidth direction="column" horizontal="center" gap="8">
              <Text
                variant={`body-default-${size}`}
                onBackground="neutral-strong"
                className="cursor-interactive"
                onClick={(event: any) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleViewModeToggle("years");
                }}
              >
                {currentYear}
              </Text>
            </Flex>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronRight"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleYearChange(1);
              }}
            />
          </>
        );
      }

      if (viewMode === "years") {
        return (
          <>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronLeft"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleYearRangeChange(-1);
              }}
            />
            <Flex fillWidth direction="column" horizontal="center" gap="8">
              <Text
                variant={`body-default-${size}`}
                onBackground="neutral-strong"
              >
                {yearRangeStart} - {yearRangeStart + 11}
              </Text>
            </Flex>
            <IconButton
              variant="tertiary"
              size={size === "l" ? "l" : "m"}
              icon="chevronRight"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                handleYearRangeChange(1);
              }}
            />
          </>
        );
      }
    };

    const renderContent = () => {
      if (isTimeSelector) {
        return (
          <Flex fillWidth direction="column" gap="16">
            <Flex fillWidth direction="column" horizontal="center" gap="8">
              <SegmentedControl
                buttons={[
                  { value: "AM", label: "AM" },
                  { value: "PM", label: "PM" },
                ]}
                selected={isPM ? "PM" : "AM"}
                onToggle={(value) => {
                  handleTimeChange(
                    selectedTime?.hours ?? 0,
                    selectedTime?.minutes ?? 0,
                    value === "PM"
                  );
                }}
              />
            </Flex>
            <Flex fillWidth direction="column" horizontal="center" gap="8">
              <NumberInput
                id="hours"
                label="Hours"
                min={1}
                max={12}
                value={
                  selectedTime?.hours ? convert24to12(selectedTime.hours) : 12
                }
                onChange={(value) => {
                  if (value >= 1 && value <= 12) {
                    handleTimeChange(value, selectedTime?.minutes ?? 0, isPM);
                  }
                }}
              />
              <NumberInput
                id="minutes"
                label="Minutes"
                min={0}
                max={59}
                value={selectedTime?.minutes ?? 0}
                onChange={(value) => {
                  if (value >= 0 && value <= 59) {
                    handleTimeChange(selectedTime?.hours ?? 0, value, isPM);
                  }
                }}
              />
            </Flex>
          </Flex>
        );
      }

      if (viewMode === "days") {
        return (
          <Flex fillWidth direction="column" gap="8">
            <Grid columns={7} gap="4" fillWidth>
              {dayNames.map((day) => (
                <Flex key={day} fillWidth horizontal="center">
                  <Text
                    variant="label-default-s"
                    onBackground="neutral-weak"
                    weight="strong"
                  >
                    {day}
                  </Text>
                </Flex>
              ))}
            </Grid>
            <Grid columns={7} gap="4" fillWidth>
              {renderDaysView()}
            </Grid>
            {timePicker && (
              <Flex fillWidth horizontal="center">
                <Text
                  className="cursor-interactive"
                  variant="label-default-s"
                  onBackground="brand-weak"
                  onClick={() => handleTimeToggle(true)}
                >
                  Set time
                </Text>
              </Flex>
            )}
          </Flex>
        );
      }

      if (viewMode === "months") {
        return (
          <Grid columns={3} gap="8" fillWidth>
            {renderMonthsView()}
          </Grid>
        );
      }

      if (viewMode === "years") {
        return (
          <Grid columns={3} gap="8" fillWidth>
            {renderYearsView()}
          </Grid>
        );
      }
    };

    return (
      <Flex
        ref={ref}
        className={classNames(styles.calendar, className)}
        style={style}
        direction="column"
        fillWidth
        horizontal="center"
        gap={size}
        {...rest}
      >
        <Flex fillWidth center>
          {renderHeader()}
        </Flex>

        <Flex
          fillWidth
          horizontal="center"
          vertical="center"
          key={`${viewMode}-${isTimeSelector ? "time" : "date"}`}
        >
          {renderContent()}
        </Flex>
      </Flex>
    );
  }
);

DatePicker.displayName = "DatePicker";
