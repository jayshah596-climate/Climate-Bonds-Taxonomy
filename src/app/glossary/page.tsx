import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { getGlossary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Key Climate Bonds Taxonomy and Certification terms, explained.",
};

export default function GlossaryPage() {
  const glossary = [...getGlossary()].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <>
      <PageHeader crumbs={[{ label: "Glossary" }]} title="Glossary" description="Key terms used across the Climate Bonds Taxonomy, Standard and Certification Scheme." />
      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glossary.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold">{g.term}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{g.definition}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
