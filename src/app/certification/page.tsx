import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Section, SectionHeading } from "@/components/common/section";
import { CertificationPathway } from "@/components/certification/pathway";
import { getCertificationPathway, getGlossary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Certification Pathway",
  description:
    "The full Climate Bonds Certification journey from idea to impact reporting — requirements, documents and official guidance for every stage.",
};

export default function CertificationPage() {
  const stages = getCertificationPathway();
  const glossary = getGlossary().filter((g) =>
    ["gl-certification", "gl-verifier", "gl-use-of-proceeds", "gl-post-issuance"].includes(g.id)
  );

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Certification Pathway" }]}
        title="Certification Pathway"
        description="From first idea to impact reporting: nine stages that take a project from eligibility screening to a fully Certified Climate Bond."
      />
      <Section>
        <CertificationPathway stages={stages} />
      </Section>
      <Section className="pt-0">
        <SectionHeading eyebrow="Key terms" title="Certification vocabulary" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <h4 className="font-display font-semibold">{g.term}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{g.definition}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
