import { useState, useEffect } from 'react';
import { Provider } from '@/app/types/provider';
import { Job } from '@/app/types/job';
import { Language } from '@/app/types/language';

// Interface pour la compatibilité avec l'ancien code
export interface ProviderWithLegacyData {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  avatar: string;
  location: string;
  languages: string[];
  job?: Job;
}

export interface SocialLink {
  name: string;
  icon: string;
  link: string;
}

export interface ProviderAbout {
  intro: {
    display: boolean;
    title: string;
    description: string;
  };
  work: {
    display: boolean;
    title: string;
    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: string[];
      images: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  studies: {
    display: boolean;
    title: string;
    institutions: Array<{
      degreeTitle: string;
      institutionName: string;
      yearsAttended: string;
      programDescription: string;
    }>;
  };
  technical: {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description: string;
      images: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  calendar: {
    display: boolean;
    link: string;
  };
  tableOfContent: {
    display: boolean;
  };
  avatar: {
    display: boolean;
  };
}

export function useProvider(slug: string) {
  const [provider, setProvider] = useState<ProviderWithLegacyData | null>(null);
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [about, setAbout] = useState<ProviderAbout | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviderData() {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le provider avec ses détails
        const providerResponse = await fetch(`/api/providers/${slug}`);
        if (!providerResponse.ok) {
          throw new Error('Provider not found');
        }
        const providerData: Provider = await providerResponse.json();

        // Récupérer le job du provider
        const jobResponse = await fetch(`/api/providers/id/${providerData.providerId}/job`);
        const jobData: Job | undefined = jobResponse.ok ? await jobResponse.json() : undefined;

        // Récupérer les langues du provider
        const languagesResponse = await fetch(`/api/providers/id/${providerData.providerId}/languages`);
        const languagesData: Language[] = languagesResponse.ok ? await languagesResponse.json() : [];

        // Récupérer les articles du provider
        const articlesResponse = await fetch(`/api/providers/${slug}/articles`);
        const articlesData = articlesResponse.ok ? await articlesResponse.json() : [];

        // Adapter les données pour la compatibilité avec l'ancien code
        setProvider({
          id: providerData.providerId,
          slug: providerData.slug,
          firstName: providerData.firstName,
          lastName: providerData.lastName,
          role: jobData?.title || 'Expert IA',
          email: providerData.email,
          avatar: providerData.avatar,
          location: providerData.location,
          languages: languagesData.map(lang => lang.name),
          job: jobData
        });
        
        setSocial([]); // Pour l'instant, pas de social links
        setArticles(articlesData); // Articles du provider
        
        // Créer des données about par défaut
        const aboutData: ProviderAbout = {
          intro: {
            display: true,
            title: "Introduction",
            description: `${providerData.firstName} ${providerData.lastName} est un professionnel passionné par l'innovation technologique. Spécialisé dans ${jobData?.title || 'l\'intelligence artificielle'}, il/elle combine expertise technique et vision stratégique pour créer des solutions intelligentes qui transforment les industries.`
          },
          work: {
            display: true,
            title: "Mon expérience professionnelle",
            experiences: [{
              company: "Entreprise Tech",
              timeframe: "2020 - Aujourd'hui",
              role: jobData?.title || "Expert IA",
              achievements: ["Développé et déployé des solutions innovantes améliorant les performances de 30%."],
              images: [{
                src: "/images/projects/project-01/NVIDIA.jpg",
                alt: "Entreprise Tech",
                width: 16,
                height: 9
              }]
            }]
          },
          studies: {
            display: true,
            title: "Études et Formation",
            institutions: [{
              degreeTitle: "Master en Informatique",
              institutionName: "Université de Technologie",
              yearsAttended: "2018 - 2020",
              programDescription: "Formation approfondie en technologies modernes et développement de solutions innovantes."
            }]
          },
          technical: {
            display: true,
            title: "Mes Technologies",
            skills: [{
              title: "Technologies Modernes",
              description: "Expertise en développement de solutions technologiques avancées et optimisation de performances.",
              images: [{
                src: "/images/tech/cuda.jpg",
                alt: "Technologies",
                width: 16,
                height: 9
              }]
            }]
          },
          calendar: {
            display: false,
            link: "#"
          },
          tableOfContent: {
            display: false
          },
          avatar: {
            display: true
          }
        };
        
        setAbout(aboutData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProviderData();
    }
  }, [slug]);

  return { 
    provider, 
    social, 
    about, 
    articles, 
    loading, 
    error 
  };
}
