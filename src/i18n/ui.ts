/* ==========================================================================
   i18n/ui.ts — UI string dictionaries (FR default, EN under /en/)
   Content (projects, etc.) lives in content collections; this is chrome only.
   ========================================================================== */

export const languages = {
  fr: "Français",
  en: "English",
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = "fr";

export const ui = {
  fr: {
    "nav.home": "Accueil",
    "nav.projects": "Projets",
    "nav.cv": "CV",
    "nav.experiences": "Expériences",
    "nav.contact": "Contact",
    "nav.skipToContent": "Aller au contenu",
    "lang.switchTo": "EN",
    "footer.rights": "Tous droits réservés",
    "projects.title": "Projets",
    "projects.intro": "L'ensemble de mes projets académiques, personnels et réalisés en entreprise.",
    "projects.filter.all": "Tous",
    "projects.filter.dl": "Deep Learning",
    "projects.filter.ml": "Machine Learning",
    "projects.filter.dev": "Génie logiciel",
    "projects.filter.active": "Domaine\u00A0:",
    "projects.empty": "Aucun projet dans cette catégorie.",
    "project.context": "Contexte",
    "project.approach": "Approche",
    "project.pipeline": "Pipeline",
    "project.stack": "Stack technique",
    "project.results": "Résultats",
    "project.viewCode": "Voir le code",
    "project.back": "Tous les projets",
    "project.next": "Projet suivant",
    "home.role": "Ingénieur Data & IA",
    "home.statement": "Ingénieur en Intelligence Artificielle et Sciences des données diplômé de l'École des Mines d'Alès, je réponds à des problématiques concrètes d'intégration de l'IA dans des systèmes complexes. Je conçois des agents capables de raisonner sur un contexte, d'utiliser des outils, d'interagir avec des services logiciels et d'enchaîner plusieurs tâches de manière contrôlée.",
    "home.current.label": "Actuellement",
    "home.current.value": "Stage de fin d'études chez Orange terminé. Disponible immédiatement pour un poste d'Ingénieur IA / Data.",
    "home.cta.projects": "Voir les projets",
    "home.cta.contact": "Me contacter",
    "home.domains.title": "Thématiques",
    "home.domains.intro": "Filtrez mes projets selon les sujets qui vous intéressent.",
    "home.domains.count": "projet",
    "home.domains.count.plural": "projets",
    "home.work.title": "Mes derniers travaux",
    "home.work.intro": "De la préparation des données au déploiement : découvrez mes derniers projets.",
    "home.work.all": "Tous les projets",
    "home.exp.title": "Expériences",
    "home.exp.intro": "Deux événements marquants qui ont façonné ma manière de travailler.",
    "home.exp.all": "Toutes les expériences",
    "home.contact.title": "Me contacter",
    "home.contact.text": "N'hésitez pas à me contacter pour échanger sur des opportunités professionnelles ou à consulter mon CV détaillé.",
    "home.contact.cta": "Envoyer un e-mail",
    "home.contact.cv": "Consulter le CV",
  },
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.cv": "Resume",
    "nav.experiences": "Experiences",
    "nav.contact": "Contact",
    "nav.skipToContent": "Skip to content",
    "lang.switchTo": "FR",
    "footer.rights": "All rights reserved",
    "projects.title": "Projects",
    "projects.intro": "All of my academic, personal, and industry projects.",
    "projects.filter.all": "All",
    "projects.filter.dl": "Deep Learning",
    "projects.filter.ml": "Machine Learning",
    "projects.filter.dev": "Software Engineering",
    "projects.filter.active": "Area:",
    "projects.empty": "No project in this category.",
    "project.context": "Context",
    "project.approach": "Approach",
    "project.pipeline": "Pipeline",
    "project.stack": "Tech stack",
    "project.results": "Results",
    "project.viewCode": "View code",
    "project.back": "All projects",
    "project.next": "Next project",
    "home.role": "Data & AI Engineer",
    "home.statement": "Artificial Intelligence and Data Science Engineer graduated from IMT Mines Alès, I tackle concrete challenges of integrating AI into complex systems. I design agents capable of reasoning over context, using tools, interacting with software services, and chaining multiple tasks in a controlled manner.",
    "home.current.label": "Currently",
    "home.current.value": "End-of-studies internship at Orange completed. Immediately available for an AI / Data Engineer position.",
    "home.cta.projects": "View projects",
    "home.cta.contact": "Get in touch",
    "home.domains.title": "Topics",
    "home.domains.intro": "Filter my projects by the topics that interest you.",
    "home.domains.count": "project",
    "home.domains.count.plural": "projects",
    "home.work.title": "Most recent work",
    "home.work.intro": "From applied research to production-ready solutions: discover my latest projects.",
    "home.work.all": "All projects",
    "home.exp.title": "Experiences",
    "home.exp.intro": "Two key events that shaped my way of working.",
    "home.exp.all": "All experiences",
    "home.contact.title": "Contact Me",
    "home.contact.text": "Feel free to contact me to discuss professional opportunities or to view my detailed resume.",
    "home.contact.cta": "Send an e-mail",
    "home.contact.cv": "View resume",
  },
} as const;

/** Taxonomy domain labels (shared keys, localized display). */
export const taxonomy: Record<string, { fr: string; en: string }> = {
  llm: { fr: "Large Langage Model (LLM)", en: "Large Language Models (LLM)" },
  "computer-vision": { fr: "Vision par ordinateur (CNN)", en: "Computer Vision (CNN)" },
  "self-supervised-learning": { fr: "Apprentissage auto-supervisé (SSL)", en: "Self-Supervised Learning (SSL)" },
  "reinforcement-learning": { fr: "Apprentissage par renforcement", en: "Reinforcement Learning" },
  "time-series": { fr: "Séries temporelles", en: "Time Series" },
  classification: { fr: "Classification", en: "Classification" },
  regression: { fr: "Régression", en: "Regression" },
  clustering: { fr: "Clustering", en: "Clustering" },
  "software-engineering": { fr: "Génie logiciel", en: "Software Engineering" },
  "combinatorial-optimization": {
    fr: "Optimisation combinatoire",
    en: "Combinatorial Optimization",
  },
  "data-engineering": { fr: "Data Engineering", en: "Data Engineering" },
  cybersecurity: { fr: "Cybersécurité", en: "Cybersecurity" },
};

export function taxonomyLabel(key: string, lang: Lang): string {
  return taxonomy[key]?.[lang] ?? key;
}

export type UIKey = keyof (typeof ui)["fr"];

/** Returns a translator bound to a language, falling back to the default. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Extract the active language from a URL pathname. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  if (maybeLang in languages) return maybeLang as Lang;
  return defaultLang;
}

/** Prefix a root-relative path for a given language (EN lives under /en/). */
export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? "/en/" : `/en${clean}`;
}

/** Strip the locale prefix from a pathname, returning the canonical FR path. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/** URL of the equivalent page in the other language (for the toggle). */
export function getAltLangUrl(url: URL): string {
  const lang = getLangFromUrl(url);
  const canonical = stripLocale(url.pathname);
  if (canonical.startsWith("/404")) {
    return lang === "fr" ? "/en/404/" : "/404";
  }
  return localizedPath(canonical, lang === "fr" ? "en" : "fr");
}

/** Primary navigation items (labels localized, hrefs prefixed per language). */
export function getNavItems(lang: Lang) {
  const t = useTranslations(lang);
  return [
    { key: "home", href: localizedPath("/", lang), label: t("nav.home") },
    { key: "projects", href: localizedPath("/projects", lang), label: t("nav.projects") },
    { key: "experiences", href: localizedPath("/experiences", lang), label: t("nav.experiences") },
    { key: "cv", href: localizedPath("/cv", lang), label: t("nav.cv") },
  ];
}

