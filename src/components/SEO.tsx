import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LandingPage } from "../types";
import { LANDING_PAGES } from "../content/pages";
import { BLOG_ARTICLES } from "../content/blog";

type RouteSEO = {
  metaTitle: string;
  metaDesc: string;
  canonical: string;
  title: string;
  id: string;
  article?: (typeof BLOG_ARTICLES)[number];
};

interface SEOProps {
  page?: LandingPage;
}

const BASE_DOMAIN = "https://textcase.in";
const DEFAULT_TITLE = "TextCase – Fix Broken Text Instantly";
const DEFAULT_DESCRIPTION = "Repair broken copied text from ChatGPT, PDF, OCR, Markdown and Unicode instantly. Fast, free and browser-based.";

function setMeta(attrName: "name" | "property", attrValue: string, contentValue: string) {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", contentValue);
}

function getRouteSEO(pathname: string, suppliedPage?: LandingPage): RouteSEO {
  if (suppliedPage) {
    return {
      metaTitle: suppliedPage.metaTitle,
      metaDesc: suppliedPage.metaDesc,
      canonical: suppliedPage.canonical,
      title: suppliedPage.title,
      id: suppliedPage.id
    };
  }

  if (pathname === "/" || pathname === "") return LANDING_PAGES.default;

  const landingSlug = pathname.replace(/^\//, "");
  if (LANDING_PAGES[landingSlug]) return LANDING_PAGES[landingSlug];

  if (pathname === "/blog") {
    return {
      metaTitle: "TextCase Guides – Text Repair, PDF, OCR & AI Formatting",
      metaDesc: "Practical guides for fixing copied text, PDF line breaks, OCR artifacts, Markdown, Unicode and AI formatting with TextCase.",
      canonical: `${BASE_DOMAIN}/blog`,
      title: "TextCase Knowledge Hub",
      id: "blog"
    };
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    const article = BLOG_ARTICLES.find((item) => item.slug === slug || item.id === slug);
    if (article) {
      return {
        metaTitle: `${article.title} | TextCase`,
        metaDesc: article.excerpt,
        canonical: `${BASE_DOMAIN}/blog/${article.slug}`,
        title: article.title,
        id: `blog-${article.id}`,
        article
      };
    }
  }

  const staticPages: Record<string, { title: string; description: string }> = {
    "/about": { title: "About TextCase | Smart Text Repair", description: "Learn how TextCase repairs messy copied text directly in your browser." },
    "/contact": { title: "Contact TextCase", description: "Contact the TextCase team with questions, feedback, or bug reports." },
    "/privacy": { title: "Privacy Policy | TextCase", description: "Read the TextCase privacy policy and learn how browser-based text processing works." },
    "/terms": { title: "Terms of Service | TextCase", description: "Read the terms of service for TextCase." },
    "/roadmap": { title: "TextCase Roadmap", description: "See planned improvements and upcoming features for TextCase." },
    "/changelog": { title: "TextCase Changelog", description: "See recent product updates and changes to TextCase." },
    "/feedback": { title: "TextCase Feedback", description: "Send feedback and suggestions for improving TextCase." },
    "/sitemap": { title: "TextCase Sitemap", description: "Browse the main pages and tools available on TextCase." },
    "/robots": { title: "TextCase Robots.txt", description: "View the robots.txt information for TextCase." }
  };

  const staticPage = staticPages[pathname];
  if (staticPage) {
    return {
      metaTitle: staticPage.title,
      metaDesc: staticPage.description,
      canonical: `${BASE_DOMAIN}${pathname}`,
      title: staticPage.title,
      id: `static-${pathname.slice(1)}`
    };
  }

  return {
    metaTitle: "Page Not Found | TextCase",
    metaDesc: "The requested TextCase page could not be found.",
    canonical: `${BASE_DOMAIN}${pathname}`,
    title: "Page Not Found",
    id: "not-found"
  };
}

export default function SEO({ page }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const route = getRouteSEO(location.pathname, page);
    const pageCanonical = route.canonical || `${BASE_DOMAIN}/`;
    const title = route.metaTitle || DEFAULT_TITLE;
    const description = route.metaDesc || DEFAULT_DESCRIPTION;

    document.title = title;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", description);

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) keywordsMeta.remove();

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageCanonical);

    const ogImage = `${BASE_DOMAIN}/og-image.png`;
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:url", pageCanonical);
    setMeta("property", "og:type", route.article ? "article" : "website");
    setMeta("property", "og:site_name", "TextCase");
    setMeta("property", "og:locale", "en_US");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "theme-color", "#2563eb");
    setMeta("name", "color-scheme", "light dark");

    const schemaId = "textcase-jsonld-schema-bundle";
    document.getElementById(schemaId)?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = schemaId;
    schemaScript.type = "application/ld+json";

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${BASE_DOMAIN}/#organization`,
      "name": "TextCase",
      "url": BASE_DOMAIN,
      "logo": `${BASE_DOMAIN}/favicon.svg`
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE_DOMAIN}/#website`,
      "name": "TextCase",
      "url": BASE_DOMAIN,
      "publisher": { "@id": `${BASE_DOMAIN}/#organization` }
    };

    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageCanonical}#webpage`,
      "url": pageCanonical,
      "name": title,
      "description": description,
      "isPartOf": { "@id": `${BASE_DOMAIN}/#website` }
    };

    const schemas: unknown[] = [organizationSchema, websiteSchema, webpageSchema];
    const landingSlug = location.pathname.replace(/^\//, "");
    const isLandingPage = location.pathname === "/" || Boolean(LANDING_PAGES[landingSlug]);

    if (isLandingPage) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${BASE_DOMAIN}/#software`,
        "name": "TextCase Text Formatting & Repair Tool",
        "url": BASE_DOMAIN,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Clean messy copy-pastes, remove formatting symbols, and fix OCR glitches in your browser."
      });
    }

    if (route.article) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": route.article.title,
        "description": route.article.excerpt,
        "datePublished": route.article.date,
        "mainEntityOfPage": { "@id": `${pageCanonical}#webpage` },
        "publisher": { "@id": `${BASE_DOMAIN}/#organization` }
      });
    }

    if (isLandingPage && route.id !== "default") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_DOMAIN },
          { "@type": "ListItem", "position": 2, "name": route.title, "item": pageCanonical }
        ]
      });
    }

    schemaScript.textContent = JSON.stringify(schemas);
    document.head.appendChild(schemaScript);

    return () => {
      document.getElementById(schemaId)?.remove();
    };
  }, [location.pathname, page]);

  return null;
}
