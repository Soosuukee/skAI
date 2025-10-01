"use client";

import React from "react";
import { Column, Heading, Text } from "@/once-ui/components";
import { useServiceData } from "./ServiceContext";
import { formatPrice } from "@/app/utils/priceUtils";

export const Service = {
  Title: () => {
    const { service } = useServiceData();
    return (
      <Heading as="h1" variant="display-strong-l">
        {service.title}
      </Heading>
    );
  },

  Summary: () => {
    const { service } = useServiceData();
    if (!service.summary) return null;
    return <Text variant="body-default-l">{service.summary}</Text>;
  },

  Price: () => {
    const { service } = useServiceData();
    return (
      <Text variant="body-default-l">
        {formatPrice(service.minPrice ?? null, service.maxPrice ?? null)}
      </Text>
    );
  },

  Section: ({
    title,
    children,
  }: {
    title: string;
    children?: React.ReactNode;
  }) => {
    return (
      <Column gap="s">
        <Heading as="h2" variant="display-strong-m">
          {title}
        </Heading>
        {children}
      </Column>
    );
  },
};

