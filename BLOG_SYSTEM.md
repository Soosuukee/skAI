# Système de Blog Dynamique

Ce projet utilise maintenant un système de blog dynamique basé sur des données JSON au lieu de fichiers MDX statiques.

## Structure des données

Les articles sont stockés dans `src/data/articles.json` avec la structure suivante :

```json
{
  "article_id": 1,
  "provider_id": 1,
  "slug": "mon-article",
  "title": "Titre de l'article",
  "summary": "Résumé de l'article",
  "published_at": "2025-01-01",
  "image": "/images/blog/mon-image.jpg",
  "tag": "Catégorie",
  "language": "fr",
  "content": {
    "sections": [
      {
        "type": "heading",
        "content": "Titre de section",
        "level": 2
      },
      {
        "type": "paragraph",
        "content": "Contenu du paragraphe..."
      },
      {
        "type": "code",
        "content": "console.log('Hello World');",
        "language": "javascript"
      },
      {
        "type": "list",
        "items": ["Élément 1", "Élément 2", "Élément 3"]
      },
      {
        "type": "image",
        "src": "/images/mon-image.jpg",
        "alt": "Description de l'image",
        "aspectRatio": "16/9"
      },
      {
        "type": "links",
        "items": [
          {
            "text": "Lien externe",
            "url": "https://example.com"
          }
        ]
      }
    ]
  }
}
```

## Types de sections disponibles

1. **heading** - Titres (niveaux 1-6)
2. **paragraph** - Paragraphes de texte
3. **code** - Blocs de code avec coloration syntaxique
4. **list** - Listes à puces
5. **image** - Images avec ratio d'aspect configurable
6. **links** - Liens externes

## Ajout d'un nouvel article

### Méthode 1 : Script interactif

```bash
npm run add-article
```

Le script vous guidera à travers la création d'un article complet.

### Méthode 2 : Édition manuelle

1. Ouvrez `src/data/articles.json`
2. Ajoutez un nouvel objet article à la fin du tableau
3. Suivez la structure JSON ci-dessus
4. Assurez-vous que l'`article_id` est unique

## Avantages du système dynamique

- ✅ **Facilité d'ajout** : Plus besoin de créer des fichiers MDX
- ✅ **Gestion centralisée** : Tous les articles dans un seul fichier
- ✅ **Flexibilité** : Structure JSON personnalisable
- ✅ **Performance** : Chargement plus rapide sans compilation MDX
- ✅ **Maintenance** : Plus simple à maintenir et modifier

## Migration depuis l'ancien système

Les anciens fichiers MDX dans `src/app/blog/posts/` ne sont plus utilisés. Le contenu a été migré vers le format JSON dans `src/data/articles.json`.

## Fonctions utilitaires

Le fichier `src/app/utils/articleUtils.ts` contient toutes les fonctions pour manipuler les articles :

- `getAllArticles()` - Récupère tous les articles
- `getArticleBySlug(slug)` - Récupère un article par son slug
- `getArticlesByTag(tag)` - Filtre les articles par tag
- `getSortedArticles()` - Articles triés par date
- `getArticleSlugs()` - Liste de tous les slugs

## Composants

- `ArticleContent.tsx` - Affiche le contenu dynamique d'un article
- `Post.tsx` - Carte d'article dans la liste
- `Posts.tsx` - Grille d'articles

## Exemple d'utilisation

```typescript
import { getArticleBySlug, getSortedArticles } from "@/app/utils/articleUtils";

// Récupérer un article spécifique
const article = getArticleBySlug("mon-article");

// Récupérer tous les articles triés par date
const articles = getSortedArticles();
```
