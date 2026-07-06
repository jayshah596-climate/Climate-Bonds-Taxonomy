import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories, getSectorsByCategory } from "@/lib/data";
import { DynamicIcon } from "@/lib/icon-map";
import { Section, SectionHeading } from "@/components/common/section";

export function CategoryGrid() {
  const categories = getCategories();
  return (
    <Section>
      <SectionHeading
        eyebrow="Main Taxonomy Explorer"
        title="Four pathways. One taxonomy."
        description="The Climate Bonds Taxonomy organises eligible assets and activities into four interconnected pathways — each with its own criteria, colour language and interactive explorer."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map((category) => {
          const sectorCount = getSectorsByCategory(category.id).length;
          return (
            <Link
              key={category.id}
              href={`/taxonomy/${category.id}`}
              className="group relative overflow-hidden rounded-3xl border border-border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${category.theme.soft}, transparent)`,
              }}
            >
              <div
                className="absolute -right-10 -top-10 size-40 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: category.theme.primary }}
              />
              <div
                className="flex size-14 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${category.theme.from}, ${category.theme.to})` }}
              >
                <DynamicIcon name={category.icon} className="size-7" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{category.name}</h3>
              <p className="mt-1 text-sm font-medium" style={{ color: category.theme.primary }}>
                {category.tagline}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{category.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {sectorCount} sectors
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: category.theme.primary }}>
                  Explore <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
