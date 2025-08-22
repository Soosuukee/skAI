import { Logo } from "@/once-ui/components";

const person = {
  firstName: "Jensen",
  lastName: "Huang",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Architecte de Solution IA",
  avatar: "/images/avatar-jh.jpg",
  email: "example@gmail.com",
  location: "Asie/Taipei", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Anglais", "Hokkien taïwanais", " Chinois Mandarin"], // optional: Leave the array empty if you don't want to display languages
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/once-ui-system/nextjs-starter",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/company/once-ui/",
  },
  {
    name: "X",
    icon: "x",
    link: "https://x.com/nvidia",
  },
];

const home = {
  path: "/home",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `Bienvenue sur le Portfolio de ${person.name}`,
  description: `Ce portfolio presente mon travail en tant que ${person.role}`,
  headline: <>Le moteur de l’IA nouvelle génération</>,
};

const about = {
  path: "/about",
  label: "A propos",
  title: `A propos de ${person.name}`,
  description: `Rencontrez ${person.name}, ${person.role} de ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Jensen Huang est un entrepreneur taïwano‑américain basé dans la
        Silicon Valley, cofondateur et PDG de NVIDIA. Visionnaire des
        processeurs graphiques et de l’IA, il transforme des défis
        technologiques complexes en innovations qui font avancer l’informatique,
        la recherche et la création numérique.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Mon experience professionel",
    experiences: [
      {
        company: "Nvidia",
        timeframe: "1993 - Aujourd'hui",
        role: "Fondateur et President Directeur Generale",
        achievements: [
          <>
            A lancé la plateforme CUDA en 2006, ouvrant le GPU au calcul
            général ; certaines charges HPC ont été accélérées jusqu’à 1 000 ×,
            faisant chuter le coût du calcul d’un facteur 1 000.
          </>,
          <>
            A transformé Nvidia en leader de l’IA : le chiffre d’affaires est
            passé d’environ 3 G$ en 2010 à plus de 130 G$ en 2025 (+3 600 %),
            hissant l’entreprise parmi les toutes premières capitalisations
            mondiales.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/NVIDIA.jpg",
            alt: "Nvidia",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Denny's",
        timeframe: "1978 - 1983",
        role: "Plongeur, Commis debarrasseur et Serveur",
        achievements: [
          <>
            Optimisé le circuit de plonge en instaurant un tri préalable et un
            remplissage méthodique des machines, réduisant le temps de rotation
            de la vaisselle de 25 %.
          </>,
          <>
            Mis en place un protocole de débarrassage et de remise en place des
            tables en équipe, accélérant la préparation des couverts de 30 % et
            augmentant le chiffre d’affaires du service du soir de 12 %.
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/Dennys.png",
            alt: "Nvidia",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Etude et Formation",
    institutions: [
      {
        degreeTitle: "Bachelor en Genie Electrique",
        institutionName: "Université de l'état d'Oregon",
        yearsAttended: "1980 - 1984",
        programDescription: (
          <>
            Parcours accrédité ABET couvrant les fondements du génie
            électrique : circuits analogiques et numériques, électronique de
            puissance, électromagnétisme, traitement du signal et
            microprocesseurs. Le cursus inclut des laboratoires pratiques chaque
            trimestre et un projet
            <em>capstone</em> en équipe consacré à la conception d’un système
            embarqué complet.
          </>
        ),
      },
      {
        degreeTitle: "Master en Genie Electrique",
        institutionName: "Universite de Stanford",
        yearsAttended: "1990 - 1992",
        programDescription: (
          <>
            Cycle de recherche axé sur les architectures matérielles avancées et
            le calcul parallèle : VLSI, conception de processeurs graphiques et
            algorithmes accélérés. Mémoire de fin d’études réalisé au Stanford
            Graphics Lab sur l’usage des GPU pour le rendu 3D en temps réel,
            aboutissant à une publication scientifique et à un prototype
            fonctionnel.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Mes Technologies",
    skills: [
      {
        title: "Cuda",
        description: (
          <>
            Plateforme de calcul parallèle lancée en 2006 : elle expose la
            puissance des GPU via C/C++ et Python, devenant le standard de facto
            pour l’IA, la HPC et le rendu scientifique.
          </>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/tech/cuda.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Architectures GPU (Tesla → Blackwell)",
        description: (
          <>
            {" "}
            Direction technique de générations phares&nbsp;: Tesla, Fermi,
            Pascal, Volta, Turing, Ampere, Hopper puis Blackwell
            (208 milliards&nbsp;de transistors, annoncé en&nbsp;2024). Chaque
            itération double (ou plus) les performances et introduit des blocs
            dédiés : Tensor Cores, RT Cores, Transformer Engines…
          </>
        ),
        images: [
          {
            src: "/images/tech/blackwell-die.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Systèmes DGX & Superchips",
        description: (
          <>
            Conception des stations DGX (AI supercomputer « clé en main ») et
            des superchips&nbsp;Grace Hopper / Grace Blackwell, capables de
            délivrer jusqu’à plusieurs dizaines de PFLOPS IA par nœud.
          </>
        ),
        images: [
          {
            src: "/images/tech/dgx-station.jpg",
            alt: "NVIDIA DGX Station",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Omniverse & Génération 3D",
        description: (
          <>
            Plateforme de simulation collaborative temps‑réel basée sur
            l’USD&nbsp;: jumeaux numériques, rendu photoréaliste et pipelines
            d’IA générative pour l’industrie, la robotique et le divertissement.
          </>
        ),
        images: [
          {
            src: "/images/tech/omniverse.jpg",
            alt: "Capture d'écran Omniverse",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};
const service = {
  path: "/service",
  label: "Services",
  title: "Mes Services",
  description: `Nous aidons les entreprises à passer de l’idée au produit`,
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: `Les articles écrits par Jensen`,
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, home, about, service, blog, work, gallery };
