import { useEffect } from "react";
import { LandingPage } from "../types";
import { FAQ_DATA } from "../content/faq";

interface SEOProps {
  page: LandingPage;
}

export default function SEO({ page }: SEOProps) {
  useEffect(() => {
    if (!page) return;

    const baseDomain = "https://textcase.in";
    
    // Normalize canonical tag to use textcase.in
    let pageCanonical = page.canonical || `${baseDomain}/`;
    if (pageCanonical.includes("textcase.io")) {
      pageCanonical = pageCanonical.replace("textcase.io", "textcase.in");
    } else if (pageCanonical.includes("localhost")) {
      pageCanonical = pageCanonical.replace(/https?:\/\/localhost:\d+/, baseDomain);
    }

    // 1. Document Title
    document.title = page.metaTitle || "TextCase – Fix Broken Text Instantly";

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", page.metaDesc);

    // 3. REMOVE keywords meta tag per SEO requirements (Google no longer uses it)
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
      keywordsMeta.remove();
    }

    // 4. Canonical Link Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageCanonical);

    // Helper to insert/update meta tag
    const setMeta = (attrName: "name" | "property", attrValue: string, contentValue: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", contentValue);
    };

    const ogImage = `${baseDomain}/og-image.png`;

    // 5. Open Graph Meta Tags
    setMeta("property", "og:title", page.metaTitle || "TextCase – Fix Broken Text Instantly");
    setMeta("property", "og:description", page.metaDesc);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:url", pageCanonical);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "TextCase");
    setMeta("property", "og:locale", "en_US");

    // 6. Twitter Card Meta Tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", page.metaTitle || "TextCase – Fix Broken Text Instantly");
    setMeta("name", "twitter:description", page.metaDesc);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:site", "@textcase_in");

    // 7. Theme colors
    setMeta("name", "theme-color", "#2563eb"); // Classic blue
    setMeta("name", "color-scheme", "light dark");

    // 8. JSON-LD Schemas injection
    const schemaId = "textcase-jsonld-schema-bundle";
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement("script");
    schemaScript.id = schemaId;
    schemaScript.type = "application/ld+json";

    // Build schema bundle containing Organization, WebSite, SoftwareApplication, WebPage, and BreadcrumbList
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseDomain}/#organization`,
      "name": "TextCase",
      "url": baseDomain,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseDomain}/apple-touch-icon.png`,
        "width": "180",
        "height": "180"
      },
      "sameAs": [
        "https://github.com/textcase"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseDomain}/#website`,
      "name": "TextCase",
      "url": baseDomain,
      "publisher": {
        "@id": `${baseDomain}/#organization`
      }
    };

    const softwareApplicationSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${baseDomain}/#software`,
      "name": "TextCase Text Formatting & Repair Tool",
      "url": baseDomain,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Clean messy copy-pastes, remove formatting symbols, and fix OCR glitches in one click."
    };

    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageCanonical}/#webpage`,
      "url": pageCanonical,
      "name": page.metaTitle,
      "description": page.metaDesc,
      "isPartOf": {
        "@id": `${baseDomain}/#website`
      },
      "about": {
        "@id": `${baseDomain}/#software`
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseDomain
        },
        ...(page.id !== "default" ? [
          {
            "@type": "ListItem",
            "position": 2,
            "name": page.title,
            "item": pageCanonical
          }
        ] : [])
      ]
    };

    // FAQ schema for the landing pages (always valid schema.org)
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_DATA.slice(0, 6).map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const schemas = [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      webpageSchema,
      breadcrumbSchema,
      faqSchema
    ];

    schemaScript.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(schemaScript);

    return () => {
      // Clean up dynamic scripts on unmount
      const script = document.getElementById(schemaId);
      if (script) script.remove();
    };
  }, [page]);

  return null;
}
