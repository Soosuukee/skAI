# Services des Providers - Système MDX

Ce dossier contient les fichiers MDX des services proposés par les providers. Chaque service est défini dans un fichier MDX séparé avec des métadonnées et du contenu riche.

## Structure des fichiers

Chaque fichier MDX doit suivre cette structure :

```mdx
---
title: "Nom du service"
provider: "slug-du-provider"
service_id: "identifiant-unique-du-service"
summary: "Description courte du service"
publishedAt: "YYYY-MM-DD"
min_price: 5000
max_price: 15000
images:
  - "/images/services/category/cover-01.jpg"
  - "/images/services/category/cover-02.jpg"
---

## Contenu du service

Le contenu détaillé du service en format Markdown...
```

## Métadonnées requises

- **title** : Nom du service
- **provider** : Slug du provider (doit correspondre à celui dans `providers.json`)
- **service_id** : Identifiant unique du service
- **summary** : Description courte du service
- **publishedAt** : Date de publication (format YYYY-MM-DD)
- **min_price** : Prix minimum (en euros, null pour "Sur devis")
- **max_price** : Prix maximum (en euros, null pour "Sur devis")
- **images** : Liste des images du service (optionnel)

## Conventions de nommage

- Nom du fichier : `{provider-slug}-{service-name}.mdx`
- Exemple : `jensen-huang-gpu-optimization.mdx`

## Contenu MDX

Le contenu peut inclure :

- Titres et sous-titres (##, ###, etc.)
- Listes à puces et numérotées
- **Texte en gras**
- _Texte en italique_
- `Code inline`
- Images
- Tableaux
- Liens
- Citations

## Exemple de service

Voir `jensen-huang-gpu-optimization.mdx` pour un exemple complet.

## Intégration

Les services sont automatiquement chargés et affichés sur :

- La page de détail du service : `/providers/{slug}/service/{serviceSlug}`
- La liste des services du provider : `/providers/{slug}/service`

## Gestion des erreurs

Si un service n'a pas de fichier MDX correspondant, la page affichera un contenu par défaut avec les informations de base du service.
