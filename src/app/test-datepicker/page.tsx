"use client";

import React, { useState } from "react";
import { DatePicker, Flex, Text } from "@/once-ui/components";

export default function TestDatePickerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <Text variant="heading-1" style={{ marginBottom: "1rem" }}>
        Test DatePicker
      </Text>

      <Flex direction="column" gap="16">
        <Text variant="body-default-m">
          Date sélectionnée:{" "}
          {selectedDate ? selectedDate.toLocaleDateString("fr-FR") : "Aucune"}
        </Text>

        <DatePicker
          value={selectedDate || undefined}
          onChange={(date) => setSelectedDate(date)}
          size="m"
          monthYearSelector
        />
      </Flex>
    </div>
  );
}
