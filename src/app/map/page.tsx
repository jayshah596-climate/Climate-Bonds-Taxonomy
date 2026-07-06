import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { WorldMap } from "@/components/map/map-loader";
import { getCaseStudies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Global Map",
  description: "Explore Climate Bonds Certified issuance and case studies around the world.",
};

export default function MapPage() {
  const caseStudies = getCaseStudies();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Global Map" }]}
        title="Global Climate Bonds Map"
        description="Certified issuance and case studies plotted by country. Click a marker to see sector, bond size and impact, then jump straight to the relevant criteria."
        showPrint={false}
      />
      <Section>
        <WorldMap />
        <p className="mt-4 text-xs text-muted-foreground">
          Showing {caseStudies.length} verified certified-bond case studies sourced from the Climate Bonds Certified
          Bonds Database. Basemap © OpenStreetMap contributors, © CARTO.
        </p>
      </Section>
    </>
  );
}
