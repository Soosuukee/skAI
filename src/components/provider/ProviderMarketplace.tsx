"use client";

import React, { useMemo, useState } from "react";
import { Column, Grid, Text } from "@/once-ui/components";
import { providers as data } from "@/app/resources/providers";
import { ProviderCard } from "./ProviderCard";
import { SearchFilters } from "./SearchFilters";

export const ProviderMarketplace: React.FC = () => {
  const professions = useMemo(
    () => Array.from(new Set(data.map((p) => p.profession))).sort(),
    []
  );
  const countries = useMemo(
    () => Array.from(new Set(data.map((p) => p.country))).sort(),
    []
  );
  const technologies = useMemo(
    () => Array.from(new Set(data.flatMap((p) => p.technologies))).sort(),
    []
  );

  const [filters, setFilters] = useState({
    profession: "",
    country: "",
    technology: "",
  });

  const filtered = data.filter((p) => {
    return (
      (!filters.profession || p.profession === filters.profession) &&
      (!filters.country || p.country === filters.country) &&
      (!filters.technology || p.technologies.includes(filters.technology))
    );
  });

  return (
    <Column gap="l" fillWidth>
      <SearchFilters
        professions={professions}
        countries={countries}
        technologies={technologies}
        value={filters}
        onChange={setFilters}
      />
      {filtered.length === 0 ? (
        <Text variant="body-default-m" onBackground="neutral-medium">
          Aucun provider ne correspond aux filtres.
        </Text>
      ) : (
        <Grid columns="2" mobileColumns="1" gap="12" fillWidth>
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </Grid>
      )}
    </Column>
  );
};
