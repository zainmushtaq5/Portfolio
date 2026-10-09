import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export type SeoInput = {
  title: string; // page title WITHOUT the brand; the layout title template adds it
  description: string; // aim for 140-160 characters
  path: string; // "/" or "/projects/al-shifa-chatbot"
  noindex?: boolean;
  type?: "website" | "article" | "profile";
};

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  type = "website",
}: SeoInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: { title, description, url, type, siteName: "Zain Awan" },
    twitter: { card: "summary_large_image", title, description },
  };
}

type PersonInput = {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs: string[]; // real profile URLs only
  knowsAbout: string[];
  alumniOf?: string;
};

export function personJsonLd(p: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: p.name,
    url: SITE_URL,
    jobTitle: p.jobTitle,
    description: p.description,
    ...(p.image ? { image: p.image } : {}),
    sameAs: p.sameAs,
    knowsAbout: p.knowsAbout,
    ...(p.alumniOf
      ? { alumniOf: { "@type": "EducationalOrganization", name: p.alumniOf } }
      : {}),
    address: { "@type": "PostalAddress", addressCountry: "PK" },
  };
}

export function websiteJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

type ProjectInput = {
  name: string;
  description: string;
  path: string;
  keywords: string[];
  liveUrl?: string;
  image?: string;
};

export function projectJsonLd(p: ProjectInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    description: p.description,
    url: absoluteUrl(p.path),
    keywords: p.keywords.join(", "),
    creator: { "@id": PERSON_ID },
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    ...(p.liveUrl ? { sameAs: [p.liveUrl] } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
