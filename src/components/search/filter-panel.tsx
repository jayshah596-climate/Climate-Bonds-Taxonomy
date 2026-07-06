"use client";

import { cn } from "@/lib/utils";
import type { SearchItemType } from "@/lib/search";
import type { CategoryId } from "@/lib/types";
import { getCategories } from "@/lib/data";

const TYPES: { value: SearchItemType; label: string }[] = [
  { value: "sector", label: "Sectors" },
  { value: "category", label: "Taxonomies" },
  { value: "download", label: "Downloads" },
  { value: "blog", label: "Blog" },
  { value: "casestudy", label: "Case Studies" },
  { value: "faq", label: "FAQ" },
  { value: "glossary", label: "Glossary" },
];

export function FilterPanel({
  type,
  categoryId,
  onTypeChange,
  onCategoryChange,
}: {
  type: SearchItemType | null;
  categoryId: CategoryId | null;
  onTypeChange: (t: SearchItemType | null) => void;
  onCategoryChange: (c: CategoryId | null) => void;
}) {
  const categories = getCategories();
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content type</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              !type ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
            )}
          >
            All
          </button>
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                type === t.value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Taxonomy</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              !categoryId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
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
      </div>
    </div>
  );
}
