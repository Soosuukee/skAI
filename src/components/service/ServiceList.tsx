"use client";

import React from "react";
import { Column } from "@/once-ui/components";
import { ServiceCard } from "@/components/service/ServiceCard";
import type { Service } from "@/app/types/service";

interface ServiceListProps {
  services: (Service & { providerSlug: string })[];
}

export const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  return (
    <Column fillWidth gap="l">
      {services.map((s, idx) => (
        <ServiceCard
          key={s.id ?? s.slug}
          service={s}
          providerSlug={s.providerSlug}
          index={idx}
        />
      ))}
    </Column>
  );
};

export default ServiceList;
