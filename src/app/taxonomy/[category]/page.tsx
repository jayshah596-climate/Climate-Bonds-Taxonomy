import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { SectorCard } from "@/components/taxonomy/sector-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategories, getCategory, getSectorsByCategory } from "@/lib/data";
import { DynamicIcon } from "@/lib/icon-map";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categoryId } = await props.params;
  const category = getCategory(categoryId);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await props.params;
  const category = getCategory(categoryId);
  if (!category) notFound();

  const sectors = getSectorsByCategory(category.id);
  const available = sectors.filter((s) => s.status === "available").length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Taxonomy Explorer", href: "/taxonomy" }, { label: category.name }]}
        title={category.name}
        description={category.description}
        badge={
          <span
            className="flex size-11 items-center justify-center rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${category.theme.from}, ${category.theme.to})` }}
          >
            <DynamicIcon name={category.icon} className="size-5" />
          </span>
        }
      >
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">{sectors.length} sectors tracked</Badge>
          <Badge variant="success">{available} available for certification</Badge>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <a href={category.officialUrl} target="_blank" rel="noreferrer">
              Official Climate Bonds page <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </PageHeader>

      <Section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} category={category} />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-2xl border border-border bg-secondary/40 p-6">
          <h3 className="font-display font-semibold">Explore the other pathways</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {getCategories()
              .filter((c) => c.id !== category.id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/taxonomy/${c.id}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </Section>
    </>
  );
}
