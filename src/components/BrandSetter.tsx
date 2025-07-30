"use client";

import { useEffect } from "react";

interface BrandSetterProps {
  brand: string;
}

/**
 * BrandSetter sets the `data-brand` attribute on the <html> element
 * allowing per-page brand color overrides (e.g. red, green, yellow).
 */
export default function BrandSetter({ brand }: BrandSetterProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-brand") || "cyan";
    root.setAttribute("data-brand", brand);

    return () => {
      // restore previous brand when unmounting to avoid leaking style to other routes
      root.setAttribute("data-brand", previous);
    };
  }, [brand]);

  return null;
}
