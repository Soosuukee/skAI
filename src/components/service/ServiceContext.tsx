"use client";

import React, { createContext, useContext } from "react";
import type { Service } from "@/app/types/service";
import type { Provider } from "@/app/types/provider";

export interface ServiceRenderData {
  service: Service;
  provider: Pick<Provider, "firstName" | "lastName"> & {
    phone?: string;
  };
}

const ServiceContext = createContext<ServiceRenderData | null>(null);

export function ServiceProvider({
  data,
  children,
}: {
  data: ServiceRenderData;
  children: React.ReactNode;
}) {
  return (
    <ServiceContext.Provider value={data}>{children}</ServiceContext.Provider>
  );
}

export function useServiceData(): ServiceRenderData {
  const ctx = useContext(ServiceContext);
  if (!ctx) {
    throw new Error("useServiceData must be used within a ServiceProvider");
  }
  return ctx;
}
