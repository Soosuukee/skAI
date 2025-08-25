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

### 2. **Données complètes du provider (ProviderWithDetails)**

```
GET /api/providers/{slug}
```

**Réponse :**

```json
{
  "providerId": 1,
  "slug": "jensen-huang",
  "firstName": "Jensen",
  "lastName": "Huang",
  "role": "Architecte de Solution IA",
  "email": "example@gmail.com",
  "avatar": "/images/avatar-jh.jpg",
  "location": "Taïwan",
  "languages": ["Anglais", "Hokkien taïwanais", "Chinois Mandarin"],
  "bio": "Entrepreneur taïwano‑américain...",
  "summary": "Spécialiste en IA et GPU...",
  "hourlyRate": 150,
  "availability": "Disponible",
  "timezone": "Asia/Taipei",
  "website": "https://example.com",
  "isActive": true,
  "isVerified": true,
  "rating": 4.8,
  "reviewCount": 25,
  "completedProjects": 15,
  "responseTime": "2h",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-12-01T00:00:00Z",
  "skills": [1, 9, 19, 20, 21],
  "experiences": [
    {
      "id": 1,
      "providerId": 1,
      "title": "CEO & Founder",
      "company": "NVIDIA",
      "startDate": "1993-01-01",
      "endDate": null,
      "description": "Fondation et direction de NVIDIA...",
      "achievements": ["Création de CUDA", "Développement des GPU..."]
    }
  ],
  "education": [
    {
      "id": 1,
      "providerId": 1,
      "degree": "Master en Ingénierie Électrique",
      "institution": "Stanford University",
      "startDate": "1988-09-01",
      "endDate": "1990-06-01",
      "description": "Spécialisation en microélectronique..."
    }
  ],
  "socialLinks": [
    {
      "id": 1,
      "providerId": 1,
      "name": "GitHub",
      "icon": "github",
      "link": "https://github.com/jensen-huang"
    },
    {
      "id": 2,
      "providerId": 1,
      "name": "LinkedIn",
      "icon": "linkedin",
      "link": "https://linkedin.com/in/jensen-huang"
    }
  ],
  "services": [
    {
      "id": 1,
      "providerId": 1,
      "slug": "conseil-strategique-ia-gpu",
      "title": "Conseil Stratégique IA & GPU",
      "description": "Optimisation des solutions GPU...",
      "price": 150,
      "duration": "2h"
    }
  ],
  "articles": [
    {
      "id": 1,
      "providerId": 1,
      "slug": "prise-en-main-rapide-avec-deepep",
      "title": "DeepEP : la bibliothèque de communication ultime...",
      "summary": "Découvrez comment DeepEP révolutionne...",
      "publishedAt": "2025-07-24",
      "image": "/images/blog/deepep/deepep-cover.jpg",
      "tag": "Deep Learning",
      "language": "fr"
    }
  ],
  "jobDetails": {
    "id": 1,
    "title": "Architecte de Solution IA",
    "description": "Conception et implémentation de solutions IA...",
    "requirements": ["Expertise en GPU", "Machine Learning..."]
  }
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
// Récupérer toutes les données du provider en une seule requête
const providerWithDetails = await fetch(`/api/providers/${slug}`).then((r) =>
  r.json()
);

// Accéder aux différentes sections
const {
  firstName,
  lastName,
  role,
  socialLinks,
  experiences,
  education,
  services,
  articles,
} = providerWithDetails;
```

## ✅ **Avantages de cette architecture**

1. **Performance optimisée** : Un seul appel API au lieu de 4
2. **Cohérence des données** : Toutes les données arrivent ensemble
3. **Type safety** : Interface TypeScript complète avec `ProviderWithDetails`
4. **Simplicité** : Moins de code côté client
5. **Maintenabilité** : Architecture plus simple et centralisée
6. **Évolutivité** : Facile d'ajouter de nouvelles relations

## 🚀 **Prochaines étapes**

- [x] ✅ Créer la page liste des providers
- [ ] Ajouter des endpoints pour les services
- [ ] Ajouter des endpoints pour les projets/work
- [ ] Ajouter des endpoints pour la galerie
- [ ] Implémenter la pagination pour les articles
- [ ] Ajouter des filtres et de la recherche
