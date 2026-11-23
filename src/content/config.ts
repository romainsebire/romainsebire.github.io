import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    /** Tech-clear title (no boasts). */
    title: z.string(),
    /** Short technical subtitle shown under the title. */
    tagline: z.string(),
    /** One-sentence problem statement for the index/cards. */
    summary: z.string(),
    /** Top-level family driving the project filter. */
    category: z.enum(["dl", "ml", "dev"]),
    /** Taxonomy domain keys (see i18n taxonomy dict). */
    domains: z.array(z.string()),
    /** Tech stack tags (shown verbatim, language-agnostic). */
    stack: z.array(z.string()),
    github: z.string().url().optional(),
    cta: z
      .object({
        url: z.string(),
        label: z.string(),
        icon: z.enum(["github", "link", "medal"]).optional(),
      })
      .optional(),
    /** Sober factual venue badge (publication, competition...). */
    venue: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    /** Optional cover image path under /images. */
    cover: z.string().optional(),
    /** Optional video URL. */
    video: z.string().optional(),
    /** Optional images for display. */
    images: z.array(
      z.object({
        url: z.string(),
        caption: z.string().optional(),
      })
    ).optional(),
    /** Optional grouped images for display. */
    imageGroups: z.array(
      z.object({
        caption: z.string().optional(),
        images: z.array(
          z.object({
            url: z.string(),
            alt: z.string().optional(),
          })
        ),
      })
    ).optional(),
    /** Computation environment (hardware, docker, cloud, etc.). */
    environment: z.string().optional(),
    /** Project period or date (Month Year). */
    date: z.string().optional(),
  }),
});

export const collections = { projects };
