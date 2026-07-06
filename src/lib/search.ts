import Fuse, { type IFuseOptions } from "fuse.js";
import {
  getCategories,
  getSectors,
  getDownloads,
  getBlogs,
  getCaseStudies,
  getFaqs,
  getGlossary,
} from "@/lib/data";
import type { CategoryId } from "@/lib/types";

export type SearchItemType =
  | "category"
  | "sector"
  | "download"
  | "blog"
  | "casestudy"
  | "faq"
  | "glossary";

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  href: string;
  categoryId?: CategoryId;
  tags: string[];
}

export function buildSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const c of getCategories()) {
    items.push({
      id: `category:${c.id}`,
      type: "category",
      title: c.name,
      description: c.description,
      href: `/taxonomy/${c.id}`,
      categoryId: c.id,
      tags: [c.tagline],
    });
  }

  for (const s of getSectors()) {
    items.push({
      id: `sector:${s.id}`,
      type: "sector",
      title: s.name,
      description: s.description,
      href: `/taxonomy/${s.categoryId}/${s.id}`,
      categoryId: s.categoryId,
      tags: [s.status, ...s.eligibleActivities.slice(0, 3)],
    });
  }

  for (const d of getDownloads()) {
    items.push({
      id: `download:${d.id}`,
      type: "download",
      title: d.title,
      description: d.description ?? "",
      href: `/downloads?doc=${d.id}`,
      tags: [d.type],
    });
  }

  for (const b of getBlogs()) {
    items.push({
      id: `blog:${b.id}`,
      type: "blog",
      title: b.title,
      description: b.summary,
      href: `/blog/${b.slug}`,
      tags: b.tags,
    });
  }

  for (const cs of getCaseStudies()) {
    items.push({
      id: `casestudy:${cs.id}`,
      type: "casestudy",
      title: cs.title,
      description: `${cs.country} · ${cs.impact}`,
      href: `/case-studies/${cs.id}`,
      tags: [cs.country, cs.region],
    });
  }

  for (const f of getFaqs()) {
    items.push({
      id: `faq:${f.id}`,
      type: "faq",
      title: f.question,
      description: f.answer,
      href: `/faq#${f.id}`,
      tags: [],
    });
  }

  for (const g of getGlossary()) {
    items.push({
      id: `glossary:${g.id}`,
      type: "glossary",
      title: g.term,
      description: g.definition,
      href: `/glossary#${g.id}`,
      tags: [],
    });
  }

  return items;
}

const fuseOptions: IFuseOptions<SearchItem> = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.2 },
  ],
  threshold: 0.32,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

let cachedFuse: Fuse<SearchItem> | null = null;
let cachedItems: SearchItem[] | null = null;

export function getSearchIndex() {
  if (!cachedFuse || !cachedItems) {
    cachedItems = buildSearchItems();
    cachedFuse = new Fuse(cachedItems, fuseOptions);
  }
  return { fuse: cachedFuse, items: cachedItems };
}

export function search(query: string, opts?: { type?: SearchItemType; categoryId?: CategoryId; limit?: number }) {
  const { fuse } = getSearchIndex();
  if (!query.trim()) return [];
  let results = fuse.search(query, { limit: opts?.limit ?? 40 }).map((r) => r.item);
  if (opts?.type) results = results.filter((r) => r.type === opts.type);
  if (opts?.categoryId) results = results.filter((r) => r.categoryId === opts.categoryId);
  return results;
}

const QUESTION_STOPWORDS = new Set([
  "is", "are", "the", "a", "an", "of", "to", "for", "do", "does", "i", "me",
  "what", "whats", "which", "how", "can", "could", "should", "would", "and",
  "or", "in", "on", "show", "tell", "about", "need", "my", "you", "your", "it",
]);

/** Splits a natural-language question into significant keywords, runs a
 *  separate fuzzy search per keyword, and merges results by best score.
 *  This avoids Fuse's whole-string Bitap matching failing on filler words
 *  that don't appear verbatim in the indexed content. */
export function searchQuestion(question: string, opts?: { limit?: number }) {
  const { fuse } = getSearchIndex();
  const words = question
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !QUESTION_STOPWORDS.has(w));

  if (words.length === 0) return search(question, opts);

  const best = new Map<string, { item: SearchItem; score: number }>();
  for (const word of words) {
    for (const r of fuse.search(word, { limit: 10 })) {
      const score = r.score ?? 1;
      const prev = best.get(r.item.id);
      if (!prev || score < prev.score) best.set(r.item.id, { item: r.item, score });
    }
  }

  return Array.from(best.values())
    .sort((a, b) => a.score - b.score)
    .slice(0, opts?.limit ?? 6)
    .map((b) => b.item);
}
