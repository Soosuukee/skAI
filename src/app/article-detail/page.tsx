import ArticleDetail from "@/components/blog/ArticleDetail.mdx";
import { Schema } from "@/once-ui/modules";

export default function ArticleDetailPage() {
  // Utiliser une URL dynamique pour baseURL
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/article-detail"
        title="Article dynamique depuis l'API"
        description="Ce fichier MDX rend dynamiquement le contenu des articles depuis l'API"
      />
      <ArticleDetail />
    </>
  );
}
