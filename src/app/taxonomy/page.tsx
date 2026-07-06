import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { CategoryGrid } from "@/components/home/category-grid";
import { Section, SectionHeading } from "@/components/common/section";
import { SectorCard } from "@/components/taxonomy/sector-card";
import { getCategories, getSectorsByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Taxonomy Explorer",
  description:
    "Browse the full Climate Bonds Taxonomy across Mitigation, Resilience, Blue and Methane Abatement pathways.",
};

export default function TaxonomyPage() {
  const categories = getCategories();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Taxonomy Explorer" }]}
        title="Taxonomy Explorer"
        description="Every sector, every criteria set, every official link — organised into the four Climate Bonds pathways."
      />
      <CategoryGrid />
      {categories.map((category) => {
        const sectors = getSectorsByCategory(category.id);
        return (
          <Section key={category.id} className="pt-0">
            <SectionHeading eyebrow={category.name} title={category.tagline} description={category.description} />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector) => (
                <SectorCard key={sector.id} sector={sector} category={category} />
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
