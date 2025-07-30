"use client";

import React from "react";
import { Flex, Select } from "@/once-ui/components";

interface FilterState {
  profession: string;
  country: string;
  technology: string;
}

interface SearchFiltersProps {
  professions: string[];
  countries: string[];
  technologies: string[];
  value: FilterState;
  onChange: (filters: FilterState) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  professions,
  countries,
  technologies,
  value,
  onChange,
}) => {
  const handleChange = (field: keyof FilterState, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Flex gap="12" wrap fillWidth>
      <Select
        id="profession"
        label="Métier"
        placeholder="Métier"
        options={["", ...professions].map((p) => ({
          label: p || "Tous",
          value: p,
        }))}
        value={value.profession}
        onSelect={(v) => handleChange("profession", v as string)}
      />
      <Select
        id="country"
        label="Pays"
        placeholder="Pays"
        options={["", ...countries].map((c) => ({
          label: c || "Tous",
          value: c,
        }))}
        value={value.country}
        onSelect={(v) => handleChange("country", v as string)}
      />
      <Select
        id="technology"
        label="Technologie"
        placeholder="Technologie"
        options={["", ...technologies].map((t) => ({
          label: t || "Toutes",
          value: t,
        }))}
        value={value.technology}
        onSelect={(v) => handleChange("technology", v as string)}
      />
    </Flex>
  );
};
