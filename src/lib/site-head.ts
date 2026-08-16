// Shared head assets so every page uses the exact same theme as the home page.
export const siteLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
  },
  { rel: "stylesheet", href: "/site/styles.css" },
  { rel: "stylesheet", href: "/site/premium.css" },
  { rel: "stylesheet", href: "/site/enhancements.css" },
];

export function siteMeta(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#9333ea" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export const pageLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
  },
  { rel: "stylesheet", href: "/site/pages.css" },
  { rel: "stylesheet", href: "/site/pages-theme.css" },
  { rel: "stylesheet", href: "/site/site-header.css" },
  { rel: "stylesheet", href: "/site/enhancements.css" },
];
