import { NextResponse } from "next/server";
import { kb } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 60;

function collectUrls(): { label: string; url: string }[] {
  const urls: { label: string; url: string }[] = [];
  for (const s of kb.sectors) for (const l of s.officialLinks) urls.push({ label: `${s.name} — ${l.label}`, url: l.url });
  for (const d of kb.downloads) urls.push({ label: d.title, url: d.url });
  for (const b of kb.blogs) urls.push({ label: b.title, url: b.url });
  for (const cs of kb.caseStudies) urls.push({ label: cs.title, url: cs.officialUrl });
  // De-duplicate by URL
  const seen = new Map<string, { label: string; url: string }>();
  for (const u of urls) if (!seen.has(u.url)) seen.set(u.url, u);
  return Array.from(seen.values());
}

async function checkOne(entry: { label: string; url: string }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(entry.url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    return { ...entry, status: res.status, ok: res.ok };
  } catch (err) {
    return { ...entry, status: 0, ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST() {
  const urls = collectUrls().slice(0, 40);
  const results = await Promise.all(urls.map(checkOne));
  const broken = results.filter((r) => !r.ok);
  return NextResponse.json({
    checked: results.length,
    broken: broken.length,
    results,
    note:
      "HEAD requests may fail in network-restricted sandboxes even for valid URLs; this endpoint performs real checks once deployed with outbound internet access.",
  });
}
