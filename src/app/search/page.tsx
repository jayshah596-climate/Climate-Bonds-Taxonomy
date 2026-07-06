"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Input } from "@/components/ui/input";
import { FilterPanel } from "@/components/search/filter-panel";
import { search, type SearchItemType } from "@/lib/search";
import type { CategoryId } from "@/lib/types";

function SearchPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = React.useState(params.get("q") ?? "");
  const [type, setType] = React.useState<SearchItemType | null>((params.get("type") as SearchItemType) ?? null);
  const [categoryId, setCategoryId] = React.useState<CategoryId | null>((params.get("category") as CategoryId) ?? null);

  React.useEffect(() => {
    const q = new URLSearchParams();
    if (query) q.set("q", query);
    if (type) q.set("type", type);
    if (categoryId) q.set("category", categoryId);
    router.replace(`/search${q.toString() ? `?${q.toString()}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, categoryId]);

  const results = React.useMemo(
    () => (query.trim() ? search(query, { type: type ?? undefined, categoryId: categoryId ?? undefined, limit: 60 }) : []),
    [query, type, categoryId]
  );

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Search" }]}
        title="Search the Taxonomy"
        description="Find sectors, criteria, downloads, blogs, case studies, FAQs and glossary terms across the entire indexed knowledge base."
        showPrint={false}
      >
        <div className="relative mt-6 max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. solar, buildings, methane, certification…"
            className="h-12 pl-11"
            autoFocus
          />
        </div>
      </PageHeader>
      <Section className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterPanel type={type} categoryId={categoryId} onTypeChange={setType} onCategoryChange={setCategoryId} />
        <div>
          {!query.trim() && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Start typing to search across {`{sectors, criteria, downloads, blogs, case studies, FAQs, glossary}`}.
            </p>
          )}
          {query.trim() && results.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;. Try a different term or clear filters.
            </p>
          )}
          <div className="space-y-3">
            {results.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{r.type}</span>
                  <h3 className="mt-0.5 font-medium group-hover:text-primary">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={null}>
      <SearchPageInner />
    </React.Suspense>
  );
}
