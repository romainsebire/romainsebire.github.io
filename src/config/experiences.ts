/* ==========================================================================
   experiences.ts — Single source of truth for experience metadata
   ========================================================================== */

export interface ExperienceData {
  slug: string;
  img: string;
  kicker: {
    fr: string;
    en: string;
  };
  title: {
    fr: string;
    en: string;
  };
  summary: {
    fr: string;
    en: string;
  };
}

export const experiencesList: ExperienceData[] = [
  {
    slug: "ufrj",
    img: "/images/experiences/ufrj/card-cover.webp",
    kicker: {
      fr: "Échange universitaire M1 · Rio de Janeiro · 2025",
      en: "M1 University exchange · Rio de Janeiro · 2025",
    },
    title: {
      fr: "Un semestre à l'UFRJ",
      en: "A semester at UFRJ",
    },
    summary: {
      fr: "Semestre d'échange en ingénierie informatique au Brésil : science des données, apprentissage automatique, applications concrètes et immersion culturelle complète.",
      en: "Exchange semester in computer engineering in Brazil: data science, machine learning, concrete applications, and full cultural immersion.",
    },
  },
  {
    slug: "gala",
    img: "/images/experiences/gala/card-cover.webp",
    kicker: {
      fr: "Investissement associatif · IMT Mines Alès · 2024",
      en: "Student association involvement · IMT Mines Alès · 2024",
    },
    title: {
      fr: "Responsable décors du 97ème Gala",
      en: "Decor Manager for the 97th Gala",
    },
    summary: {
      fr: "Conception, modélisation de structure 3D et construction en équipe des décors pour l'événement majeur de l'école.",
      en: "Co-designing, 3D structural modeling, and team-building decors for the school's major event.",
    },
  },
];
