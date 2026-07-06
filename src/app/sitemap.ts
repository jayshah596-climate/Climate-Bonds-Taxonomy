import type { MetadataRoute } from "next";
import { getCategories, getSectors, getBlogs, getCaseStudies } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://climate-bonds-taxonomy-explorer.vercel.app";

const staticRoutes = [
  "",
  "/taxonomy",
  "/graph",
  "/map",
  "/investors",
  "/issuers",
  "/certification",
  "/case-studies",
  "/blog",
  "/downloads",
  "/analytics",
  "/glossary",
  "/faq",
  "/search",
  "/bookmarks",
  "/compare",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${siteUrl}/taxonomy/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const sectorEntries: MetadataRoute.Sitemap = getSectors().map((s) => ({
    url: `${siteUrl}/taxonomy/${s.categoryId}/${s.id}`,
    lastModified: new Date(s.lastUpdated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = getBlogs().map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedDate),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = getCaseStudies().map((cs) => ({
    url: `${siteUrl}/case-studies/${cs.id}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...categoryEntries, ...sectorEntries, ...blogEntries, ...caseStudyEntries];
}
