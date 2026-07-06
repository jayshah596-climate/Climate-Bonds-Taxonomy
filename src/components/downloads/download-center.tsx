"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Download, ExternalLink, Eye, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, cn } from "@/lib/utils";
import type { DownloadDoc, CategoryId } from "@/lib/types";
import { getCategories } from "@/lib/data";

export function DownloadCenter({ downloads }: { downloads: DownloadDoc[] }) {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<string | null>(null);
  const [categoryId, setCategoryId] = React.useState<CategoryId | null>(null);
  const [preview, setPreview] = React.useState<DownloadDoc | null>(null);
  const categories = getCategories();
  const types = Array.from(new Set(downloads.map((d) => d.type)));
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const docId = searchParams.get("doc");
    if (!docId) return;
    const el = document.getElementById(docId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.classList.add("ring-2", "ring-primary");
  }, [searchParams]);

  const filtered = downloads.filter((d) => {
    if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (type && d.type !== type) return false;
    if (categoryId && !d.categoryIds.includes(categoryId)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="h-11 pl-11"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setType(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            !type ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
          )}
        >
          All types
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium uppercase",
              type === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
            )}
          >
            {t}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        <button
          onClick={() => setCategoryId(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            !categoryId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
          )}
        >
          All taxonomies
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              categoryId === c.id ? "text-white" : "border-border hover:border-primary"
            )}
            style={categoryId === c.id ? { background: c.theme.primary, borderColor: c.theme.primary } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.id} id={d.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <FileText className="size-5" />
              </span>
              <Badge variant="outline" className="uppercase">
                {d.type}
              </Badge>
            </div>
            <h3 className="mt-3 font-display font-semibold leading-snug">{d.title}</h3>
            {d.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>}
            <p className="mt-2 text-xs text-muted-foreground">Published {formatDate(d.publishedDate)}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => setPreview(d)}>
                <Eye className="size-3.5" /> Preview
              </Button>
              <Button size="sm" className="flex-1 gap-1.5" asChild>
                <a href={d.url} target="_blank" rel="noreferrer">
                  <Download className="size-3.5" /> Get
                </a>
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No documents match your filters.
          </p>
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="h-[70vh] overflow-hidden rounded-xl border border-border">
              {preview.type === "pdf" ? (
                <iframe src={preview.url} className="size-full" title={preview.title} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                  <p>Inline preview isn&apos;t available for this file type.</p>
                  <Button asChild size="sm" className="gap-1.5">
                    <a href={preview.url} target="_blank" rel="noreferrer">
                      Open on climatebonds.net <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
