"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { SectorStatusBadge } from "@/components/taxonomy/status-badge";
import { getSector, getCategory } from "@/lib/data";
import { useAppStore } from "@/lib/store";

const rows: { label: string; render: (s: NonNullable<ReturnType<typeof getSector>>) => React.ReactNode }[] = [
  { label: "Description", render: (s) => s.description },
  {
    label: "Eligible Activities",
    render: (s) => (
      <ul className="list-disc space-y-1 pl-4">
        {s.eligibleActivities.slice(0, 5).map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    ),
  },
  {
    label: "Technical Criteria",
    render: (s) => (
      <ul className="list-disc space-y-1 pl-4">
        {s.technicalCriteria.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    ),
  },
  { label: "Certification", render: (s) => s.certificationNotes },
];

export default function ComparePage() {
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const sectors = compareList.map((id) => getSector(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Compare Criteria" }]}
        title="Compare Sector Criteria"
        description="Add up to four sectors from the Taxonomy Explorer to compare eligibility and criteria side by side."
        showPrint={false}
      >
        {sectors.length > 0 && (
          <Button variant="outline" size="sm" className="mt-4" onClick={clearCompare}>
            Clear all
          </Button>
        )}
      </PageHeader>
      <Section>
        {sectors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">
              No sectors selected yet. Open any sector page and click “Compare” to add it here.
            </p>
            <Button asChild className="mt-4">
              <Link href="/taxonomy">Browse Taxonomy Explorer</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-40" />
                  {sectors.map((s) => {
                    const category = getCategory(s.categoryId);
                    return (
                      <th key={s.id} className="border-b border-border p-3 text-left align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/taxonomy/${s.categoryId}/${s.id}`} className="font-display font-semibold hover:text-primary">
                              {s.shortName}
                            </Link>
                            {category && <p className="text-xs text-muted-foreground">{category.name}</p>}
                            <div className="mt-1.5">
                              <SectorStatusBadge status={s.status} />
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCompare(s.id)}
                            className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                            aria-label={`Remove ${s.name}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th className="border-b border-border p-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </th>
                    {sectors.map((s) => (
                      <td key={s.id} className="border-b border-border p-3 align-top text-sm text-muted-foreground">
                        {row.render(s)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  );
}
