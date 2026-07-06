import raw from "@/data/knowledge-base.json";
import type {
  KnowledgeBase,
  Category,
  Sector,
  DownloadDoc,
  BlogPost,
  CaseStudy,
  Faq,
  CategoryId,
  KnowledgeNode,
  KnowledgeEdge,
} from "@/lib/types";

export const kb = raw as unknown as KnowledgeBase;

export function getCategories(): Category[] {
  return kb.categories;
}

export function getCategory(id: string): Category | undefined {
  return kb.categories.find((c) => c.id === id);
}

export function getSectors(): Sector[] {
  return kb.sectors;
}

export function getSectorsByCategory(categoryId: CategoryId): Sector[] {
  return kb.sectors.filter((s) => s.categoryId === categoryId);
}

export function getSector(id: string): Sector | undefined {
  return kb.sectors.find((s) => s.id === id);
}

export function getDownload(id: string): DownloadDoc | undefined {
  return kb.downloads.find((d) => d.id === id);
}

export function getDownloads(): DownloadDoc[] {
  return kb.downloads;
}

export function getDownloadsForSector(sectorId: string): DownloadDoc[] {
  return kb.downloads.filter((d) => d.sectorIds.includes(sectorId));
}

export function getBlog(id: string): BlogPost | undefined {
  return kb.blogs.find((b) => b.id === id);
}

export function getBlogs(): BlogPost[] {
  return [...kb.blogs].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return kb.blogs.find((b) => b.slug === slug);
}

export function getFaq(id: string): Faq | undefined {
  return kb.faqs.find((f) => f.id === id);
}

export function getFaqs(): Faq[] {
  return kb.faqs;
}

export function getFaqsForSector(sectorId: string): Faq[] {
  return kb.faqs.filter((f) => f.sectorIds.includes(sectorId));
}

export function getCaseStudies(): CaseStudy[] {
  return kb.caseStudies;
}

export function getCaseStudy(id: string): CaseStudy | undefined {
  return kb.caseStudies.find((c) => c.id === id);
}

export function getCaseStudiesForSector(sectorId: string): CaseStudy[] {
  return kb.caseStudies.filter((c) => c.sectorIds.includes(sectorId));
}

export function getGlossary() {
  return kb.glossary;
}

export function getCertificationPathway() {
  return [...kb.certificationPathway].sort((a, b) => a.order - b.order);
}

export function getRelatedSectors(sector: Sector): Sector[] {
  return sector.relatedSectorIds
    .map((id) => getSector(id))
    .filter((s): s is Sector => Boolean(s));
}

export function getSectorBlogs(sector: Sector): BlogPost[] {
  return sector.blogIds.map((id) => getBlog(id)).filter((b): b is BlogPost => Boolean(b));
}

export function getSectorDownloads(sector: Sector): DownloadDoc[] {
  const direct = sector.downloadIds
    .map((id) => getDownload(id))
    .filter((d): d is DownloadDoc => Boolean(d));
  const linked = getDownloadsForSector(sector.id);
  const map = new Map<string, DownloadDoc>();
  [...direct, ...linked].forEach((d) => map.set(d.id, d));
  return Array.from(map.values());
}

export function getSectorFaqs(sector: Sector): Faq[] {
  const direct = sector.faqIds.map((id) => getFaq(id)).filter((f): f is Faq => Boolean(f));
  const linked = getFaqsForSector(sector.id);
  const map = new Map<string, Faq>();
  [...direct, ...linked].forEach((f) => map.set(f.id, f));
  return Array.from(map.values());
}

// ---- Aggregate stats used across Home / Analytics / Admin ----
export function getStats() {
  const sectors = getSectors();
  const available = sectors.filter((s) => s.status === "available").length;
  const inDevelopment = sectors.filter((s) => s.status !== "available").length;
  return {
    categories: kb.categories.length,
    sectors: sectors.length,
    sectorsAvailable: available,
    sectorsInDevelopment: inDevelopment,
    downloads: kb.downloads.length,
    blogs: kb.blogs.length,
    caseStudies: kb.caseStudies.length,
    faqs: kb.faqs.length,
    glossaryTerms: kb.glossary.length,
    certificationStages: kb.certificationPathway.length,
    lastCrawled: kb.meta.lastCrawled,
    pagesDiscovered: kb.meta.pagesDiscovered,
  };
}

export function getSectorCountByCategory() {
  return kb.categories.map((c) => ({
    category: c.name,
    categoryId: c.id,
    color: c.theme.primary,
    count: getSectorsByCategory(c.id).length,
    available: getSectorsByCategory(c.id).filter((s) => s.status === "available").length,
  }));
}

export function getDownloadTypeBreakdown() {
  const counts = new Map<string, number>();
  for (const d of kb.downloads) counts.set(d.type, (counts.get(d.type) ?? 0) + 1);
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}

export function getSectorStatusBreakdown() {
  const counts = new Map<string, number>();
  for (const s of kb.sectors) counts.set(s.status, (counts.get(s.status) ?? 0) + 1);
  return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
}

export function getMostReferencedDownloads(limit = 6) {
  const counts = new Map<string, number>();
  for (const s of kb.sectors) for (const id of s.downloadIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const d of kb.downloads) counts.set(d.id, (counts.get(d.id) ?? 0) + d.sectorIds.length);
  return Array.from(counts.entries())
    .map(([id, count]) => ({ download: getDownload(id), count }))
    .filter((x): x is { download: DownloadDoc; count: number } => Boolean(x.download))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getRecentUpdates(limit = 8) {
  return [...kb.sectors]
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
    .slice(0, limit);
}

// ---- Knowledge graph construction ----
export function buildKnowledgeGraph(): { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];

  for (const c of kb.categories) {
    nodes.push({ id: `category:${c.id}`, type: "category", label: c.name, url: c.officialUrl, categoryId: c.id });
  }
  for (const s of kb.sectors) {
    nodes.push({ id: `sector:${s.id}`, type: "sector", label: s.name, categoryId: s.categoryId });
    edges.push({ source: `category:${s.categoryId}`, target: `sector:${s.id}` });
    for (const rel of s.relatedSectorIds) {
      edges.push({ source: `sector:${s.id}`, target: `sector:${rel}` });
    }
    for (const dId of s.downloadIds) edges.push({ source: `sector:${s.id}`, target: `download:${dId}` });
    for (const bId of s.blogIds) edges.push({ source: `sector:${s.id}`, target: `blog:${bId}` });
    for (const fId of s.faqIds) edges.push({ source: `sector:${s.id}`, target: `faq:${fId}` });
  }
  for (const d of kb.downloads) {
    nodes.push({ id: `download:${d.id}`, type: "download", label: d.title, url: d.url });
  }
  for (const b of kb.blogs) {
    nodes.push({ id: `blog:${b.id}`, type: "blog", label: b.title, url: b.url });
  }
  for (const f of kb.faqs) {
    nodes.push({ id: `faq:${f.id}`, type: "faq", label: f.question });
  }
  for (const cs of kb.caseStudies) {
    nodes.push({ id: `casestudy:${cs.id}`, type: "casestudy", label: cs.title, url: cs.officialUrl });
    for (const sId of cs.sectorIds) edges.push({ source: `sector:${sId}`, target: `casestudy:${cs.id}` });
  }

  return { nodes, edges };
}
