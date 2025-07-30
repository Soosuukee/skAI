export interface Provider {
  id: string;
  name: string;
  avatar: string;
  profession: string; // métier
  country: string;
  technologies: string[];
}

export const providers: Provider[] = [
  {
    id: "jensen-huang",
    name: "Jensen Huang",
    avatar: "/images/avatar-jh.jpg",
    profession: "AI Architect",
    country: "USA",
    technologies: ["CUDA", "Deep Learning", "HPC"],
  },
  {
    id: "sundar-pichai",
    name: "Sundar Pichai",
    avatar: "/images/avatar.jpg",
    profession: "Product Manager",
    country: "India",
    technologies: ["Android", "Cloud", "Leadership"],
  },
  {
    id: "satya-nadella",
    name: "Satya Nadella",
    avatar: "/images/avatar.jpg",
    profession: "Cloud Architect",
    country: "USA",
    technologies: ["Azure", "AI", "Leadership"],
  },
  {
    id: "tim-berners-lee",
    name: "Tim Berners-Lee",
    avatar: "/images/avatar.jpg",
    profession: "Web Engineer",
    country: "UK",
    technologies: ["HTML", "Web", "Open Standards"],
  },
  {
    id: "grace-hopper",
    name: "Grace Hopper",
    avatar: "/images/avatar.jpg",
    profession: "Compiler Engineer",
    country: "USA",
    technologies: ["COBOL", "Compilers", "Leadership"],
  },
  {
    id: "ada-lovelace",
    name: "Ada Lovelace",
    avatar: "/images/avatar.jpg",
    profession: "Mathematician",
    country: "UK",
    technologies: ["Algorithms", "Mathematics", "Analytical Engine"],
  }
]; 