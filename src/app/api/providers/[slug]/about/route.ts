import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import providerExperiencesData from '@/data/providerExperiences.json';
import providerAboutConfigData from '@/data/providerAboutConfig.json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Rechercher le provider par slug
    const provider = providersData.find(p => p.slug === slug);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Récupérer les expériences (avec données par défaut si pas trouvé)
    const experiences = providerExperiencesData.find(e => e.provider_id === provider.id);
    
    // Récupérer la configuration about (avec données par défaut si pas trouvé)
    const aboutConfig = providerAboutConfigData.find(c => c.provider_id === provider.id);
    
    // Données par défaut pour tous les providers
    const defaultAboutData = {
      intro: {
        display: true,
        title: "Introduction",
        description: `${provider.firstName} ${provider.lastName} est un professionnel passionné par l'innovation technologique. Spécialisé dans ${provider.role.toLowerCase()}, il/elle combine expertise technique et vision stratégique pour créer des solutions intelligentes qui transforment les industries.`
      },
      work: {
        display: true,
        title: "Mon experience professionel",
        experiences: [
          {
            company: "Entreprise Tech",
            timeframe: "2020 - Aujourd'hui",
            role: provider.role,
            achievements: [
              "Développé et déployé des solutions innovantes améliorant les performances de 30%.",
              "Dirigé des projets technologiques complexes avec une équipe de 5+ personnes."
            ],
            images: [
              {
                src: "/images/projects/project-01/NVIDIA.jpg",
                alt: "Entreprise Tech",
                width: 16,
                height: 9
              }
            ]
          }
        ]
      },
      studies: {
        display: true,
        title: "Etude et Formation",
        institutions: [
          {
            degreeTitle: "Master en Informatique",
            institutionName: "Université de Technologie",
            yearsAttended: "2018 - 2020",
            programDescription: "Formation approfondie en technologies modernes et développement de solutions innovantes."
          }
        ]
      },
      technical: {
        display: true,
        title: "Mes Technologies",
        skills: [
          {
            title: "Technologies Modernes",
            description: "Expertise en développement de solutions technologiques avancées et optimisation de performances.",
            images: [
              {
                src: "/images/tech/cuda.jpg",
                alt: "Technologies",
                width: 16,
                height: 9
              }
            ]
          }
        ]
      }
    };
    
    // Fusionner les données existantes avec les données par défaut
    const aboutData = {
      ...defaultAboutData,
      ...experiences?.about,
      tableOfContent: aboutConfig?.tableOfContent || { display: true, subItems: false },
      avatar: aboutConfig?.avatar || { display: true },
      calendar: aboutConfig?.calendar || { display: false, link: "https://cal.com" }
    };
    
    return NextResponse.json({
      provider_id: provider.id,
      about: aboutData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
