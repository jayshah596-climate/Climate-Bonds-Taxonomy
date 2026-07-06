import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { getCategories } from "@/lib/data";
import { KnowledgeGraph } from "@/components/graph/graph-loader";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description: "An interactive network of every Climate Bonds Taxonomy category, sector, criteria and resource.",
};

export default function GraphPage() {
  const categories = getCategories();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Knowledge Graph" }]}
        title="Knowledge Graph"
        description="Every taxonomy, sector, criteria, download, blog and FAQ — as one interconnected network. Click a sector node to inspect it."
        showPrint={false}
      />
      <Section>
        <div className="mb-4 flex flex-wrap gap-3">
          {categories.map((c) => (
            <span key={c.id} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium">
              <span className="size-2 rounded-full" style={{ background: c.theme.primary }} />
              {c.name}
            </span>
          ))}
        </div>
        <KnowledgeGraph />
      </Section>
    </>
  );
}
