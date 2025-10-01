import ProvidersListClient from "./ProvidersListClient";
import { baseURL } from "@/app/resources";
export const metadata = {
  title: "Liste des prestataires IA",
  description:
    "Découvrez tous les prestataires spécialisés en intelligence artificielle disponibles sur skAi.",
  alternates: {
    canonical: `${baseURL}/providers`,
  },
};

export default function ProvidersPage() {
  return (
    <ProvidersListClient
      title={(metadata.title as string) ?? "Liste des prestataires IA"}
      description={
        (metadata.description as string) ??
        "Découvrez tous les prestataires spécialisés en intelligence artificielle disponibles sur skAi."
      }
      baseURL={baseURL}
    />
  );
}
