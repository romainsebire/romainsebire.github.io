import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** All projects sorted by their declared order and filtered by language. */
export async function getProjects(lang: "fr" | "en" = "fr"): Promise<Project[]> {
  const all = await getCollection("projects", (entry) => entry.slug.startsWith(`${lang}/`));
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Featured projects only (for the home editorial index). */
export async function getFeatured(lang: "fr" | "en" = "fr"): Promise<Project[]> {
  return (await getProjects(lang)).filter((p) => p.data.featured);
}
