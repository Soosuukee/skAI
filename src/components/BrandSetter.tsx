"use client";

import { useEffect } from "react";

interface BrandSetterProps {
  brand: string;
}

export default function BrandSetter({ brand }: BrandSetterProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-color", brand);
  }, [brand]);

  return null;
}
