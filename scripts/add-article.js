#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const articlesPath = path.join(__dirname, "../src/data/articles.json");

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

function addSection() {
  return new Promise(async (resolve) => {
    const sectionTypes = [
      "heading",
      "paragraph",
      "code",
      "list",
      "image",
      "links",
    ];

    console.log("\nTypes de sections disponibles:");
    sectionTypes.forEach((type, index) => {
      console.log(`${index + 1}. ${type}`);
    });

    const typeChoice = await question(
      "\nChoisissez le type de section (1-6): "
    );
    const type = sectionTypes[parseInt(typeChoice) - 1];

    const section = { type };

    switch (type) {
      case "heading":
        section.content = await question("Contenu du titre: ");
        section.level = parseInt(await question("Niveau (1-6): "));
        break;

      case "paragraph":
        section.content = await question("Contenu du paragraphe: ");
        break;

      case "code":
        section.content = await question("Code: ");
        section.language = await question("Langage (bash, python, js, etc.): ");
        break;

      case "list":
        const items = [];
        console.log(
          "Entrez les éléments de la liste (ligne vide pour terminer):"
        );
        while (true) {
          const item = await question("> ");
          if (!item.trim()) break;
          items.push(item);
        }
        section.items = items;
        break;

      case "image":
        section.src = await question("Chemin de l'image: ");
        section.alt = await question("Texte alternatif: ");
        section.aspectRatio =
          (await question("Ratio d'aspect (16/9): ")) || "16/9";
        break;

      case "links":
        const linkItems = [];
        console.log(
          "Entrez les liens (format: texte|url, ligne vide pour terminer):"
        );
        while (true) {
          const link = await question("> ");
          if (!link.trim()) break;
          const [text, url] = link.split("|");
          linkItems.push({ text: text.trim(), url: url.trim() });
        }
        section.items = linkItems;
        break;
    }

    resolve(section);
  });
}

async function addArticle() {
  try {
    console.log("=== Ajout d'un nouvel article ===\n");

    // Lecture des articles existants
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
    const nextId = Math.max(...articlesData.map((a) => a.article_id)) + 1;

    // Collecte des informations de base
    const title = await question("Titre de l'article: ");
    const summary = await question("Résumé: ");
    const tag = await question("Tag: ");
    const image = await question("Chemin de l'image de couverture: ");

    const slug = generateSlug(title);

    // Collecte des sections
    const sections = [];
    console.log("\n=== Ajout des sections ===");

    while (true) {
      const addMore = await question("\nAjouter une section ? (o/n): ");
      if (addMore.toLowerCase() !== "o") break;

      const section = await addSection();
      sections.push(section);
    }

    // Création de l'article
    const newArticle = {
      article_id: nextId,
      provider_id: 1,
      slug,
      title,
      summary,
      published_at: new Date().toISOString().split("T")[0],
      image,
      tag,
      language: "fr",
      content: {
        sections,
      },
    };

    // Ajout à la liste
    articlesData.push(newArticle);

    // Sauvegarde
    fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2));

    console.log("\n✅ Article ajouté avec succès !");
    console.log(`📝 Slug: ${slug}`);
    console.log(`🔗 URL: /blog/${slug}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'article:", error);
  } finally {
    rl.close();
  }
}

// Vérification que le script est exécuté directement
if (require.main === module) {
  addArticle();
}

module.exports = { addArticle };
