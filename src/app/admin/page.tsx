"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw, ShieldAlert, History, Bell, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStats, getBlogs, getRecentUpdates } from "@/lib/data";
import { formatDate } from "@/lib/utils";

interface LinkCheckResult {
  checked: number;
  broken: number;
  note: string;
  results: { label: string; url: string; status: number; ok: boolean }[];
}

export default function AdminPage() {
  const stats = getStats();
  const blogs = getBlogs().slice(0, 5);
  const recentUpdates = getRecentUpdates(6);

  const [crawling, setCrawling] = React.useState(false);
  const [crawlLog, setCrawlLog] = React.useState<string | null>(null);
  const [checking, setChecking] = React.useState(false);
  const [linkResult, setLinkResult] = React.useState<LinkCheckResult | null>(null);

  async function runRecrawl() {
    setCrawling(true);
    setCrawlLog(null);
    try {
      const res = await fetch("/api/admin/recrawl", { method: "POST" });
      const data = await res.json();
      setCrawlLog(data.log ?? "Crawl finished with no output.");
    } catch {
      setCrawlLog("Request failed.");
    } finally {
      setCrawling(false);
    }
  }

  async function runLinkCheck() {
    setChecking(true);
    setLinkResult(null);
    try {
      const res = await fetch("/api/admin/check-links", { method: "POST" });
      const data = await res.json();
      setLinkResult(data);
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin" }]}
        title="Admin Panel"
        description="Manage the taxonomy index: trigger a recrawl, check for broken links, and review recent content updates."
        showPrint={false}
      />
      <Section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="size-4 text-primary" /> Refresh Website Index
            </CardTitle>
            <CardDescription>
              Runs the real BFS crawler (scripts/crawl.mjs) against climatebonds.net server-side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">Last curated {formatDate(stats.lastCrawled)}</Badge>
              <Badge variant="secondary">{stats.pagesDiscovered} pages in last snapshot</Badge>
            </div>
            <Button className="mt-4 gap-2" onClick={runRecrawl} disabled={crawling}>
              {crawling ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {crawling ? "Crawling…" : "Trigger recrawl"}
            </Button>
            {crawlLog && (
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-secondary/60 p-3 text-xs">
                {crawlLog}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" /> Broken Link Detection
            </CardTitle>
            <CardDescription>Runs live HEAD requests against every official link and download in the index.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="gap-2" onClick={runLinkCheck} disabled={checking}>
              {checking ? <Loader2 className="size-4 animate-spin" /> : <ShieldAlert className="size-4" />}
              {checking ? "Checking…" : "Run link check"}
            </Button>
            {linkResult && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Checked {linkResult.checked} links · {linkResult.broken} flagged
                </p>
                <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto scrollbar-thin">
                  {linkResult.results.map((r) => (
                    <div key={r.url} className="flex items-center gap-2 text-xs">
                      {r.ok ? (
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="size-3.5 shrink-0 text-red-500" />
                      )}
                      <span className="truncate">{r.label}</span>
                      <span className="ml-auto shrink-0 text-muted-foreground">{r.status || "—"}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{linkResult.note}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Section>

      <Section className="pt-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-4 text-primary" /> Content Version History
            </CardTitle>
            <CardDescription>Sector criteria updates, most recent first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentUpdates.map((s) => (
              <Link
                key={s.id}
                href={`/taxonomy/${s.categoryId}/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
              >
                <span>{s.name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(s.lastUpdated)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4 text-primary" /> Update Notifications
            </CardTitle>
            <CardDescription>Latest taxonomy blog posts, used to power the Blog Hub.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
              >
                <span className="truncate">{b.title}</span>
                <span className="ml-2 shrink-0 text-xs text-muted-foreground">{formatDate(b.publishedDate)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
