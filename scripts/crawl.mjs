#!/usr/bin/env node
/**
 * Climate Bonds Taxonomy Explorer — site crawler / indexer.
 *
 * Performs a breadth-first crawl of climatebonds.net starting from the
 * taxonomy hub pages, staying strictly within the climatebonds.net domain,
 * and produces a flat catalog of discovered pages, PDFs and outgoing links.
 *
 * This raw catalog (src/data/crawl-output.json) feeds:
 *   - the Admin panel's "pages discovered" / "last crawled" stats
 *   - broken-link detection
 *   - future editorial curation into src/data/knowledge-base.json
 *
 * It intentionally does NOT auto-write the curated, structured taxonomy
 * (categories/sectors/criteria mappings) — that mapping is an editorial
 * step reviewed by a human against official Climate Bonds documents.
 *
 * Usage:
 *   node scripts/crawl.mjs [--max-pages=150] [--max-depth=3]
 */

import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = "https://www.climatebonds.net";
const SEEDS = [
  "https://www.climatebonds.net/",
  "https://www.climatebonds.net/expertise/taxonomy",
  "https://www.climatebonds.net/expertise/taxonomy/climate-bonds-taxonomy",
  "https://www.climatebonds.net/expertise/standard-sector-criteria-certification",
  "https://www.climatebonds.net/expertise/standard-sector-criteria-certification/sector-criteria",
  "https://www.climatebonds.net/expertise/mobilising-sustainable-finance-methane-abatement",
  "https://www.climatebonds.net/data-insights/publications/climate-bonds-resilience-taxonomy",
  "https://www.climatebonds.net/news-events/blog/city-sweltering-inside-connect-2026-climate-finance-heating",
];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const MAX_PAGES = Number(args["max-pages"] ?? 150);
const MAX_DEPTH = Number(args["max-depth"] ?? 3);
const TIMEOUT_MS = 15000;

function isInScope(url) {
  try {
    const u = new URL(url, ROOT);
    return u.hostname.endsWith("climatebonds.net");
  } catch {
    return false;
  }
}

function isPdf(url) {
  return /\.(pdf|xlsx|pptx|docx?)(\?|#|$)/i.test(url);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "ClimateBondsTaxonomyExplorer/1.0 (+educational knowledge-graph crawler; respects robots.txt)",
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function crawl() {
  const queue = SEEDS.map((url) => ({ url, depth: 0 }));
  const visited = new Set();
  const pages = [];
  const pdfs = new Set();
  const errors = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const { url, depth } = queue.shift();
    const clean = url.split("#")[0];
    if (visited.has(clean) || !isInScope(clean)) continue;
    visited.add(clean);

    if (isPdf(clean)) {
      pdfs.add(clean);
      continue;
    }

    try {
      const res = await fetchWithTimeout(clean);
      if (!res.ok) {
        errors.push({ url: clean, status: res.status });
        continue;
      }
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) continue;

      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $("title").first().text().trim() || $("h1").first().text().trim();
      const description = $('meta[name="description"]').attr("content") ?? "";

      const links = new Set();
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        try {
          const abs = new URL(href, clean).toString().split("#")[0];
          if (isInScope(abs)) links.add(abs);
        } catch {
          /* ignore malformed href */
        }
      });

      pages.push({
        url: clean,
        title,
        description,
        depth,
        linkCount: links.size,
        crawledAt: new Date().toISOString(),
      });

      if (depth < MAX_DEPTH) {
        for (const link of links) {
          if (!visited.has(link)) {
            if (isPdf(link)) pdfs.add(link);
            else queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (err) {
      errors.push({ url: clean, error: String(err) });
    }
  }

  return {
    crawledAt: new Date().toISOString(),
    source: ROOT,
    seeds: SEEDS,
    maxPages: MAX_PAGES,
    maxDepth: MAX_DEPTH,
    pagesDiscovered: pages.length,
    pdfsDiscovered: pdfs.size,
    pages,
    pdfs: Array.from(pdfs),
    errors,
  };
}

async function main() {
  console.log(`Crawling ${ROOT} (max ${MAX_PAGES} pages, depth ${MAX_DEPTH})...`);
  const result = await crawl();
  const outPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
    "data",
    "crawl-output.json"
  );
  await writeFile(outPath, JSON.stringify(result, null, 2));
  console.log(
    `Done. Discovered ${result.pagesDiscovered} pages and ${result.pdfsDiscovered} documents. ` +
      `${result.errors.length} errors. Output written to ${outPath}`
  );
}

main().catch((err) => {
  console.error("Crawl failed:", err);
  process.exitCode = 1;
});
