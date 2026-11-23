/* ==========================================================================
   site.ts — single source of truth for site-wide config
   ========================================================================== */

export const site = {
  name: "Romain Sebire",
  domain: "romainsebire.fr",
  url: "https://romainsebire.fr",
  author: "Romain Sebire",
  email: "romain.sebire1@gmail.com",
  cvPath: "/assets/CV_Romain_Sebire.pdf",
  cvEnPath: "/assets/CV_EN_Romain_Sebire.pdf",
} as const;

export const socials = {
  github: "https://github.com/romainsebire",
  linkedin: "https://linkedin.com/in/romain-sebire",
  email: `mailto:${site.email}`,
} as const;

/**
 * Chatbot configuration.
 * - `enabled: false` removes the widget from every page entirely.
 * - When ready, set `enabled: true` and point `apiUrl` at your backend.
 *   The frontend POSTs `{ message: string }` and expects `{ reply: string }`.
 */
export const chatbot = {
  enabled: true,
  apiUrl: (import.meta.env.PUBLIC_CHATBOT_API_URL || "https://portfolio-chatbot-backend-8nvj.onrender.com/chat") as string,
} as const;
