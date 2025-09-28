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
  job: Job;
  country: Country;
  city: string;
  state: string;
  postalCode: string;
  address: string;
  description: string | null;
  birthDate: string | null;
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
  languages: Language[];
  role: "provider";
}