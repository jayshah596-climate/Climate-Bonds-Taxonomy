"use client";

import Link from "next/link";
import { Bookmark, Clock, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function BookmarksPage() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const history = useAppStore((s) => s.history);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const clearHistory = useAppStore((s) => s.clearHistory);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Bookmarks" }]}
        title="Bookmarks & History"
        description="Your saved pages and recent browsing history, stored locally in this browser."
        showPrint={false}
      />
      <Section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Bookmark className="size-4 text-primary" /> Saved ({bookmarks.length})
          </h2>
          <div className="mt-4 space-y-3">
            {bookmarks.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Nothing saved yet. Use the “Save” button on any sector, blog post or case study.
              </p>
            )}
            {bookmarks.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                <Link href={b.href} className="min-w-0">
                  <p className="truncate font-medium hover:text-primary">{b.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{b.type}</Badge>
                    Saved {formatDate(b.addedAt)}
                  </div>
                </Link>
                <button
                  onClick={() => toggleBookmark(b)}
                  className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
                  aria-label="Remove bookmark"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Clock className="size-4 text-primary" /> Recent history
            </h2>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={clearHistory}>
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {history.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Pages you open from search will appear here.
              </p>
            )}
            {history.map((h, i) => (
              <Link
                key={`${h.href}-${i}`}
                href={h.href}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-sm hover:border-primary"
              >
                <span className="truncate">{h.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(h.visitedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
