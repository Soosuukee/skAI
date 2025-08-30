## IaPlatform API – Guide pour le Front

Base URL: `http://localhost:8080/api/v1`

- CORS: origine reflétée automatiquement (pas limité à une URL). Cookies autorisés.
- Placeholders: `{id}` entier (`{id:\d+}`), `{slug}` alphanum.

### Auth

- (Public) POST `/auth/login`: connexion, crée une session (cookie PHPSESSID).
- (Privé) POST `/auth/logout`: déconnexion de la session courante.
- (Privé) GET `/auth/me`: infos de l’utilisateur courant (selon session).
- (Public) POST `/auth/register`: inscription (client ou provider selon payload).
- (Privé) POST `/auth/change-password`: changer le mot de passe.

### Providers

- (Public) GET `/providers`: liste des providers (paginations/filters côté front si besoin).
- (Public) GET `/providers/{id}`: provider par ID.
- (Public) GET `/providers/slug/{slug}`: provider par slug (forme 1).
- (Public) GET `/providers/{slug}`: provider par slug (forme 2, SEO-friendly).
- (Public) GET `/providers/country/{countryId}`: filtrer par pays (ID).
- (Public) GET `/providers/job/{jobId}`: filtrer par métier (ID).
- (Public) GET `/providers/hard-skill/{skillName}`: providers possédant la hard skill.
- (Public) GET `/providers/soft-skill/{skillName}`: providers possédant la soft skill.
- (Public) GET `/providers/language/{languageName}`: providers parlant la langue.
- (Public) GET `/providers/search/{query}`: recherche plein texte (nom, compétences...).
- (Public) GET `/providers/{providerSlug}/reviews`: avis du provider.
- (Public) GET `/providers/{providerSlug}/availability`: créneaux de dispo du provider.
- (Privé) POST `/providers`: créer un provider.
- (Privé) PUT/PATCH `/providers/{id}`: maj provider.
- (Privé) DELETE `/providers/{id}`: supprimer provider.
- (Privé) POST `/providers/{id}/profile-picture`: uploader l’avatar.

### Clients

- (Public) GET `/clients`: liste des clients.
- (Public) GET `/clients/{id}`: client par ID.
- (Public) GET `/clients/email/{email}`: client par email.
- (Public) GET `/clients/slug/{slug}`: client par slug.
- (Privé) POST `/clients`: créer un client.
- (Privé) PUT/PATCH `/clients/{id}`: maj client.
- (Privé) DELETE `/clients/{id}`: supprimer client.

### Services

- (Public) GET `/services`: liste globale.
- (Public) GET `/services/{id}`: service par ID.
- (Public) GET `/providers/{providerSlug}/services`: services d’un provider (slug, SEO-friendly recommandé).
- (Public) GET `/providers/slug/{providerSlug}/services`: services d’un provider (forme alternative).
- (Public) GET `/providers/{providerId}/services`: services d’un provider (ID).
- (Public) GET `/providers/{providerSlug}/services/{serviceSlug}`: détail par duo slug provider/service.
- (Public) GET `/providers/slug/{providerSlug}/services/{serviceSlug}`: détail (forme alternative).
- (Public) GET `/services/active`: services actifs.
- (Public) GET `/services/featured`: mis en avant.
- (Public) GET `/services/tag/{tagId}`: filtrer par tag (ID).
- (Public) GET `/services/tag/slug/{tagSlug}`: filtrer par tag (slug).
- (Public) GET `/services/search/{query}`: recherche services.
- (Privé) POST `/services`: créer un service.
- (Privé) PUT/PATCH `/services/{id}`: maj service.
- (Privé) DELETE `/services/{id}`: supprimer service.
- (Privé) POST `/services/with-content`: créer service + sections/contents.
- (Privé) PATCH `/services/{id}/with-content`: maj partielle service + contenu.
- (Privé) POST `/services/{id}/cover`: uploader cover (legacy).

Provider-scoped (médias):

- (Privé) POST `/providers/{providerId}/services/{serviceId}/cover`: uploader cover dans l’arborescence provider.
- (Privé) POST `/providers/{providerId}/services/{serviceId}/sections/{sectionId}/contents/{contentId}/images`: uploader image de contenu.
- (Privé) POST `/providers/{providerId}/{entityType:articles|experiences|education}/{entityId}/images`: uploader image d’entité.
- (Privé) POST `/services/{serviceId}/content/{contentId}/images`: uploader image (legacy service).
- (Privé) PUT/PATCH/DELETE `/services/slug/{slug}`: maintenance par slug.

### Articles

- (Public) GET `/articles`: liste globale.
- (Public) GET `/providers/{providerSlug}/articles`: articles d’un provider (slug, SEO-friendly recommandé).
- (Public) GET `/providers/slug/{providerSlug}/articles`: articles d’un provider (forme alternative).
- (Public) GET `/providers/{providerSlug}/articles/{articleSlug}`: détail article par duo de slugs.
- (Public) GET `/providers/slug/{providerSlug}/articles/{articleSlug}`: détail (forme alternative).
- (Public) GET `/articles/published`: publiés.
- (Public) GET `/articles/featured`: mis en avant.
- (Public) GET `/articles/tag/{tagId}`: par tag ID.
- (Public) GET `/articles/tag/slug/{tagSlug}`: par tag slug.
- (Public) GET `/articles/search/{query}`: recherche articles.
- (Privé) POST `/articles`: créer un article.
- (Privé) PUT/PATCH `/articles/{id}`: maj.
- (Privé) PUT/PATCH `/articles/slug/{slug}`: maj par slug.
- (Privé) DELETE `/articles/{id}` ou `/articles/slug/{slug}`: supprimer.
- (Privé) POST `/articles/with-content`: créer article + sections/contents.
- (Privé) PATCH `/articles/{id}/with-content`: maj partielle + contenu.
- (Privé) POST `/articles/{id}/cover`: uploader cover.
- (Privé) POST `/articles/{articleId}/content/{contentId}/images`: uploader image de contenu.
- (Privé) DELETE `/articles/{articleId}/content/{contentId}/images/{imageId}`: supprimer image.

### Completed Works

- (Public) GET `/completed-works`: liste des réalisations (si exposées publiquement via route).
- (Public) GET `/completed-works/{id}`: détail d’une réalisation.
- (Privé) POST `/completed-works`: créer.
- (Privé) PATCH `/completed-works/{id}`: maj partielle.
- (Privé) DELETE `/completed-works/{id}`: supprimer.
- (Privé) POST `/providers/{providerId}/completed-works/{workId}/media`: uploader un média lié.

### Soft Skills

- (Public) GET `/soft-skills` / `/soft-skills/{id}`: catalogue des soft skills.
- (Privé) POST/PUT/DELETE: maintenance du catalogue.

### Hard Skills

- (Public) GET `/hard-skills` / `/hard-skills/{id}`: catalogue des hard skills.
- (Privé) POST/PUT/DELETE: maintenance du catalogue.

### Jobs

- (Public) GET `/jobs` / `/jobs/{id}`: catalogue des métiers.
- (Privé) POST/PUT/DELETE: maintenance du catalogue.

### Languages

- (Public) GET `/languages` / `/languages/{id}`: langues disponibles.
- (Privé) POST/PUT/DELETE: maintenance des langues.

### Countries

- (Public) GET `/countries` / `/countries/{id}`: pays.
- (Privé) POST/PUT/DELETE: maintenance des pays.

### Tags

- (Public) GET `/tags` / `/tags/{id}`: liste/détail tag.
- (Privé) POST/PUT/DELETE: maintenance des tags.
- (Public) GET `/tags/{tagId}/articles` / `/tags/{tagId}/services`: contenus par tag.

### Provider: Skills & Langues

- (Public) GET `/providers/{providerId}/soft-skills` / `/hard-skills` / `/languages`: rattachements d’un provider.
- (Privé) POST/DELETE sur ces endpoints: ajouter/retirer des rattachements.

### Provider Images (génériques)

- (Privé) POST `/providers/{providerId}/images/profile|services/{serviceId}|articles/{articleId}|experiences/{experienceId}|education/{educationId}`: upload images.
- (Public) GET `/providers/{providerId}/images/{imageType}` et `/.../{subId}`: lister images.
- (Privé) DELETE équivalents: supprimer image.

### Client Images

- (Privé) POST `/clients/{clientId}/images/profile`: upload avatar client.
- (Public) GET `/clients/{clientId}/images/profile`: lister avatars.
- (Privé) DELETE `/clients/{clientId}/images/profile/{filename}`: suppression.

### Fichiers images statiques (Public)

- GET `/api/v1/images/{...}`
  - `/api/v1/images/providers/{providerId}/profile/profile-picture.jpg`
  - `/api/v1/images/providers/{providerId}/services/{serviceId}/cover/service-cover.jpg`
  - `/api/v1/images/providers/{providerId}/articles/{articleId}/article-image-1.jpg`

### Notes

- La plupart des GET listés ci‑dessus sont publics (marqués Public). Les endpoints d’écriture requièrent la session (cookie PHPSESSID).

### Exemples de requêtes/réponses

1. (Public) Liste services d’un provider par slug

- Request: GET `/providers/{providerSlug}/services`
- Response (200):

```json
[
  {
    "id": 12,
    "providerId": 4,
    "summary": "Conseil stratégique en IA...",
    "maxPrice": 15000,
    "minPrice": 15000,
    "isActive": true,
    "isFeatured": true,
    "cover": "/api/v1/images/providers/4/services/12/cover/service-cover.jpg",
    "slug": "conseil-strategique-ia",
    "sections": [
      {
        "id": 1,
        "title": "Conférences & Keynotes",
        "contents": [{ "id": 1, "content": "..." }]
      }
    ]
  }
]
```

2. (Public) Détail service via duo de slugs

- Request: GET `/providers/{providerSlug}/services/{serviceSlug}`
- Response (200):

```json
{
  "id": 12,
  "providerId": 4,
  "summary": "Conseil stratégique en IA...",
  "maxPrice": 15000,
  "minPrice": 15000,
  "isActive": true,
  "isFeatured": true,
  "cover": "/api/v1/images/providers/4/services/12/cover/service-cover.jpg",
  "slug": "conseil-strategique-ia",
  "sections": [
    {
      "id": 1,
      "title": "Conférences & Keynotes",
      "contents": [{ "id": 1, "content": "..." }]
    }
  ]
}
```

3. (Public) Liste articles d’un provider par slug

- Request: GET `/providers/{providerSlug}/articles`
- Response (200):

```json
[
  {
    "id": 21,
    "providerId": 4,
    "languageId": 1,
    "title": "ML industriel: bonnes pratiques",
    "summary": "Tour d'horizon des pratiques...",
    "slug": "ml-industriel-bonnes-pratiques",
    "isPublished": true,
    "isFeatured": false,
    "cover": "/api/v1/images/providers/4/articles/21/article-image-1.png",
    "sections": [
      {
        "id": 7,
        "title": "Introduction",
        "contents": [{ "id": 13, "content": "..." }]
      }
    ]
  }
]
```

4. (Public) Recherche services

- Request: GET `/services/search/{query}`
- Response (200):

```json
[
  {
    "id": 12,
    "providerId": 4,
    "summary": "...",
    "maxPrice": 15000,
    "minPrice": 15000,
    "isActive": true,
    "isFeatured": true,
    "cover": "/api/v1/images/...",
    "slug": "conseil-strategique-ia"
  }
]
```

5. (Privé) Upload cover service (provider connecté)

- Request: POST `/providers/{providerId}/services/{serviceId}/cover` (multipart/form-data)
- Response (200):

```json
{
  "success": true,
  "message": "Cover uploadée",
  "data": {
    "public_url": "/api/v1/images/providers/{providerId}/services/{serviceId}/cover/service-cover.jpg"
  }
}
```
