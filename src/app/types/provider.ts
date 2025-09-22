// src/app/types/provider.ts

import { Job } from "@/app/types/job";
import { Country } from "@/app/types/country";
import { Language } from "@/app/types/language";
import { SoftSkill } from "@/app/types/softskill";
import { HardSkill } from "@/app/types/hardskill";


export interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  joinedAt: string;
  slug: string;
  job: Job;  // Retiré le ? car toujours présent dans l'API
  country: Country;  // Retiré le ? car toujours présent dans l'API
  city: string;
  state?: string | null;
  postalCode?: string | null;
  address?: string | null;
  hardSkills?: HardSkill[];
  softSkills?: SoftSkill[];
  languages: Language[];
  role: "provider";
}