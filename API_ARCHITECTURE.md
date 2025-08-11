# Architecture API REST

## 🎯 **Principe**

L'API suit maintenant les bonnes pratiques REST avec des endpoints séparés pour chaque type de ressource, au lieu d'un objet monolithique.

## 📡 **Endpoints disponibles**

### 1. **Provider de base**

```
GET /api/providers/{slug}
```

**Réponse :**

```json
{
  "id": 1,
  "slug": "jensen-huang",
  "firstName": "Jensen",
  "lastName": "Huang",
  "role": "Architecte de Solution IA",
  "email": "example@gmail.com",
  "avatar": "/images/avatar-jh.jpg",
  "location": "Asie/Taipei",
  "languages": ["Anglais", "Hokkien taïwanais", "Chinois Mandarin"]
}
```

### 2. **Liens sociaux**

```
GET /api/providers/{slug}/social
```

**Réponse :**

```json
{
  "provider_id": 1,
  "social": [
    {
      "name": "GitHub",
      "icon": "github",
      "link": "https://github.com/once-ui-system/nextjs-starter"
    },
    {
      "name": "LinkedIn",
      "icon": "linkedin",
      "link": "https://www.linkedin.com/company/once-ui/"
    }
  ]
}
```

### 3. **Informations "About"**

```
GET /api/providers/{slug}/about
```

**Réponse :**

```json
{
  "provider_id": 1,
  "about": {
    "intro": {
      "display": true,
      "title": "Introduction",
      "description": "Jensen Huang est un entrepreneur taïwano‑américain..."
    },
    "work": {
      "display": true,
      "title": "Mon experience professionel",
      "experiences": [...]
    },
    "studies": {
      "display": true,
      "title": "Etude et Formation",
      "institutions": [...]
    },
    "technical": {
      "display": true,
      "title": "Mes Technologies",
      "skills": [...]
    }
  }
}
```

### 4. **Articles du provider**

```
GET /api/providers/{slug}/articles
```

**Réponse :**

```json
{
  "provider_id": 1,
  "articles": [
    {
      "article_id": 1,
      "provider_id": 1,
      "slug": "prise-en-main-rapide-avec-deepep",
      "title": "DeepEP : la bibliothèque de communication ultime...",
      "summary": "Découvrez comment DeepEP révolutionne...",
      "published_at": "2025-07-24",
      "image": "/images/blog/deepep/deepep-cover.jpg",
      "tag": "Deep Learning",
      "language": "fr",
      "content": {
        "sections": [...]
      }
    }
  ]
}
```

## 🌐 **Pages disponibles**

### **Pages statiques**

| URL            | Description                             | Statut   |
| -------------- | --------------------------------------- | -------- |
| `/providers`   | Liste de tous les providers             | ✅ Créée |
| `/about`       | Redirection vers le provider par défaut | ✅ Créée |
| `/blog`        | Blog global                             | ✅ Créée |
| `/blog/{slug}` | Article individuel (global)             | ✅ Créée |

### **Pages dynamiques par provider**

| URL                                    | Description                      | Statut                |
| -------------------------------------- | -------------------------------- | --------------------- |
| `/providers/{slug}`                    | Page principale du provider      | ✅ Créée              |
| `/providers/{slug}/about`              | Page "À propos" avec expériences | ✅ Créée              |
| `/providers/{slug}/blog`               | Tous les articles du provider    | ✅ Créée              |
| `/providers/{slug}/blog/{articleSlug}` | Article individuel du provider   | ✅ Créée              |
| `/providers/{slug}/service`            | Services du provider             | ✅ Créée (temporaire) |
| `/providers/{slug}/work`               | Projets/Portfolio                | ❌ À créer            |
| `/providers/{slug}/gallery`            | Galerie photos                   | ❌ À créer            |

## 🔧 **Utilisation côté client**

### Hook React

```typescript
import { useProvider } from "@/app/hooks/useProvider";

function MyComponent({ slug }: { slug: string }) {
  const { provider, social, about, articles, loading, error } =
    useProvider(slug);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>
        {provider.firstName} {provider.lastName}
      </h1>
      <p>{provider.role}</p>
      {/* Utiliser social, about, articles selon les besoins */}
    </div>
  );
}
```

### Appels directs

```typescript
// Récupérer seulement les données de base
const provider = await fetch(`/api/providers/${slug}`).then((r) => r.json());

// Récupérer seulement les liens sociaux
const social = await fetch(`/api/providers/${slug}/social`).then((r) =>
  r.json()
);

// Récupérer seulement les infos "about"
const about = await fetch(`/api/providers/${slug}/about`).then((r) => r.json());

// Récupérer seulement les articles
const articles = await fetch(`/api/providers/${slug}/articles`).then((r) =>
  r.json()
);
```

## ✅ **Avantages de cette architecture**

1. **Séparation des responsabilités** : Chaque endpoint a une responsabilité unique
2. **Performance** : On ne récupère que les données nécessaires
3. **Cacheabilité** : Chaque endpoint peut être mis en cache indépendamment
4. **Évolutivité** : Facile d'ajouter de nouveaux endpoints
5. **Maintenabilité** : Code plus clair et modulaire
6. **Standards REST** : Respect des conventions REST

## 🚀 **Prochaines étapes**

- [x] ✅ Créer la page liste des providers
- [ ] Ajouter des endpoints pour les services
- [ ] Ajouter des endpoints pour les projets/work
- [ ] Ajouter des endpoints pour la galerie
- [ ] Implémenter la pagination pour les articles
- [ ] Ajouter des filtres et de la recherche
