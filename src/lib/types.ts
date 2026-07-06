// Core content model for the Climate Bonds Taxonomy Explorer knowledge base.
// This shape is produced by scripts/crawl.mjs and consumed via src/lib/data.ts.

export type CategoryId = "mitigation" | "resilience" | "blue" | "methane";

export interface OfficialLink {
  label: string;
  url: string;
}

export interface DownloadDoc {
  id: string;
  title: string;
  type: "pdf" | "xlsx" | "pptx" | "doc";
  url: string;
  sectorIds: string[];
  categoryIds: CategoryId[];
  publishedDate: string; // ISO date
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  url: string;
  categoryIds: CategoryId[];
  sectorIds: string[];
  publishedDate: string;
  tags: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  country: string;
  region: string;
  sectorIds: string[];
  categoryIds: CategoryId[];
  bondSize: string;
  impact: string;
  lessons: string;
  officialUrl: string;
  lat: number;
  lng: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sectorIds: string[];
}

export interface Sector {
  id: string;
  categoryId: CategoryId;
  name: string;
  shortName: string;
  description: string;
  overview: string;
  icon: string; // lucide icon name
  eligibleActivities: string[];
  technicalCriteria: string[];
  certificationNotes: string;
  status: "available" | "in-development" | "consultation";
  officialLinks: OfficialLink[];
  downloadIds: string[];
  blogIds: string[];
  faqIds: string[];
  relatedSectorIds: string[];
  lastUpdated: string;
}

export interface CategoryTheme {
  primary: string;
  from: string;
  to: string;
  soft: string;
  text: string;
  ring: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  theme: CategoryTheme;
  officialUrl: string;
  sectorIds: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export interface CertificationStage {
  id: string;
  order: number;
  name: string;
  description: string;
  requirements: string[];
  documents: string[];
  officialUrl: string;
}

export type KnowledgeNodeType =
  | "category"
  | "sector"
  | "download"
  | "blog"
  | "casestudy"
  | "faq"
  | "certification"
  | "standard";

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
  url?: string;
  categoryId?: CategoryId;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
}

export interface CrawlMeta {
  lastCrawled: string;
  pagesDiscovered: number;
  source: string;
  mode: "live-crawl" | "curated-seed";
}

export interface KnowledgeBase {
  meta: CrawlMeta;
  categories: Category[];
  sectors: Sector[];
  downloads: DownloadDoc[];
  blogs: BlogPost[];
  caseStudies: CaseStudy[];
  faqs: Faq[];
  glossary: GlossaryTerm[];
  certificationPathway: CertificationStage[];
}
