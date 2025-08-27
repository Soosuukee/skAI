import { useState, useEffect } from 'react';
import { Provider } from '@/app/types/provider';
import { Job } from '@/app/types/job';
import { Language } from '@/app/types/language';
import { Location } from '@/app/types/location';
import { Experience } from '@/app/types/experience';
import { Education } from '@/app/types/education';

// Interface pour la compatibilité avec l'ancien code
export interface ProviderWithLegacyData {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  avatar: string;
  location: Location;
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

        // Récupérer les expériences du provider via l'API
        const experiencesResponse = await fetch(`/api/providers/id/${providerData.providerId}/experiences`);
        const experiencesData: Experience[] = experiencesResponse.ok ? await experiencesResponse.json() : [];

        // Récupérer l'éducation/diplômes du provider via l'API
        const educationResponse = await fetch(`/api/providers/id/${providerData.providerId}/education`);
        const educationData: Education[] = educationResponse.ok ? await educationResponse.json() : [];

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
        
        // Créer des données about basées sur les données API (pas de hardcode)
        const aboutData: ProviderAbout = {
          intro: {
            display: true,
            title: "Introduction",
            description: `${providerData.firstName} ${providerData.lastName} est un professionnel passionné par l'innovation technologique. Spécialisé dans ${jobData?.title || 'l\'intelligence artificielle'}, il/elle combine expertise technique et vision stratégique pour créer des solutions intelligentes qui transforment les industries. Avec une approche centrée sur l'utilisateur et une expertise approfondie dans les technologies émergentes, ${providerData.firstName} s'efforce de développer des solutions qui répondent aux défis complexes du monde moderne.`
          },
          work: {
            display: true,
            title: "Mon expérience professionnelle",
            experiences: experiencesData.map((exp) => {
              const startYear = exp.startDate ? String(exp.startDate).slice(0, 4) : '';
              const endYear = exp.endDate ? String(exp.endDate).slice(0, 4) : "Aujourd'hui";
              const achievements: string[] = [
                exp.description,
                ...(exp.task1 ? [exp.task1] : []),
                ...(exp.task2 ? [exp.task2] : []),
              ];
              return {
                company: exp.companyName,
                timeframe: `${startYear} - ${endYear}`.trim(),
                role: exp.jobTitle,
                achievements,
                images: exp.experienceImage
                  ? [{ src: exp.experienceImage, alt: exp.companyName, width: 16, height: 9 }]
                  : [],
              };
            })
          },
          studies: {
            display: true,
            title: "Études et Formation",
            institutions: educationData.map((edu) => {
              const startYear = edu.startDate ? String(edu.startDate).slice(0, 4) : '';
              const endYear = edu.endDate ? String(edu.endDate).slice(0, 4) : "Aujourd'hui";
              return {
                degreeTitle: edu.diplomaTitle,
                institutionName: edu.institutionName,
                yearsAttended: `${startYear} - ${endYear}`.trim(),
                programDescription: edu.description,
              };
            })
          },
          technical: {
            display: true,
            title: "Mes Technologies et Compétences",
            skills: await (async () => {
              try {
                const skillsResponse = await fetch(`/api/providers/id/${providerData.providerId}/skills`);
                const skillsData: Array<{ name: string; yearsOfExperience?: number; certified?: boolean; }>
                  = skillsResponse.ok ? await skillsResponse.json() : [];
                if (!skillsData.length) return [];
                // Regrouper par catégories simples via heuristique (ex: IA/ML, Vision, NLP, MLOps)
                const groups: Record<string, { title: string; description: string; images: any[] } & { items: string[] }> = {};
                const categorize = (name: string): string => {
                  const n = name.toLowerCase();
                  if (/(pytorch|tensorflow|jax|keras|cnn|rnn|lstm|gru|transformer|attention|gan|reinforcement|q-learning|policy|deep rl|rlhf|lora|quantization|pruning)/.test(n)) return 'IA & Deep Learning';
                  if (/(vision|detection|segmentation|onnx|tensorrt|cuda|triton)/.test(n)) return 'Computer Vision & Accélération GPU';
                  if (/(nlp|traitement du langage|bert|gpt|huggingface|translation|ner|classification)/.test(n)) return 'NLP';
                  if (/(mlops|kubeflow|mlflow|airflow|spark|dask|deepspeed|distributed|parallel|bayesian|hyperparameter|recommendation|anomaly)/.test(n)) return 'MLOps & Data/Infra';
                  return 'Autres';
                };
                for (const s of skillsData) {
                  const key = categorize(s.name);
                  if (!groups[key]) {
                    groups[key] = {
                      title: key,
                      description: '',
                      images: [],
                      items: []
                    };
                  }
                  const suffix = s.yearsOfExperience ? ` (${s.yearsOfExperience} ans)` : '';
                  groups[key].items.push(`${s.name}${suffix}`);
                }
                return Object.values(groups).map(g => ({
                  title: g.title,
                  description: g.items.join(' · '),
                  images: []
                }));
              } catch {
                return [];
              }
            })()
          },
          calendar: {
            display: false,
            link: "#"
          },
          tableOfContent: {
            display: true
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
