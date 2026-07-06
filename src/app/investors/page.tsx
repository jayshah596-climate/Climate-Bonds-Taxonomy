import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LineChart, ShieldAlert, Route, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section, SectionHeading } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDownload, getCaseStudies, getGlossary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Investor Hub",
  description:
    "How investors use the Climate Bonds Taxonomy for portfolio alignment, climate-risk screening and transition-pathway analysis.",
};

const useCases = [
  {
    icon: LineChart,
    title: "Portfolio Alignment",
    description:
      "Screen holdings against Mitigation and Resilience Sector Criteria to quantify Taxonomy-aligned exposure, and identify gaps against a low-carbon, climate-resilient benchmark.",
  },
  {
    icon: ShieldAlert,
    title: "Climate Risk & Resilience Screening",
    description:
      "Use the Resilience Taxonomy's substantial-contribution and no-maladaptation tests to assess whether infrastructure, water and agriculture holdings are genuinely adapting to physical climate risk.",
  },
  {
    icon: Route,
    title: "Transition Pathway Analysis",
    description:
      "Combine Sector Criteria thresholds (e.g. Steel, Hydrogen) with issuer disclosure to assess credibility of transition and sustainability-linked financing frameworks.",
  },
];

const instruments = [
  { term: "Green Bonds", def: "Use-of-proceeds instruments financing Taxonomy-eligible assets, verified pre- and post-issuance." },
  { term: "Sustainability-Linked Bonds (SLB)", def: "Financial terms tied to issuer-wide sustainability performance targets rather than specific projects." },
  { term: "Climate Bonds Certified", def: "Any of the above carrying the formal Climate Bonds Certification mark after Approved Verifier review." },
  { term: "Transition Finance", def: "Instruments financing credible decarbonisation of hard-to-abate sectors, assessed against sector-specific thresholds (e.g. Steel Criteria)." },
];

export default function InvestorsPage() {
  const standard = getDownload("d-standard-v43");
  const marketReport = getDownload("d-gsdm-2024");
  const caseStudies = getCaseStudies().slice(0, 3);
  const glossary = getGlossary().filter((g) => ["gl-sld", "gl-paris-aligned", "gl-mrv"].includes(g.id));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Investor Hub" }]}
        title="Investor Hub"
        description="How institutional investors, asset managers and banks use the Climate Bonds Taxonomy to align portfolios, screen climate risk, and evaluate transition credibility."
      />

      <Section>
        <SectionHeading eyebrow="Use Cases" title="Three ways investors use the taxonomy" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {useCases.map((u) => (
            <Card key={u.title}>
              <CardHeader>
                <u.icon className="size-6 text-primary" />
                <CardTitle className="mt-2">{u.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{u.description}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Instrument Types" title="Green, sustainability-linked, climate & transition" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {instruments.map((i) => (
            <div key={i.term} className="rounded-2xl border border-border bg-card p-5">
              <h4 className="font-display font-semibold">{i.term}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{i.def}</p>
            </div>
          ))}
          {glossary.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <h4 className="font-display font-semibold">{g.term}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{g.definition}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading className="mx-0 text-left" eyebrow="Case Studies" title="Certified issuance in practice" />
          <div className="mt-6 space-y-3">
            {caseStudies.map((cs) => (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.id}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary"
              >
                <div>
                  <p className="font-medium">{cs.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {cs.country} · {cs.bondSize}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/case-studies">View all case studies</Link>
          </Button>
        </div>
        <div>
          <SectionHeading className="mx-0 text-left" eyebrow="Download Tools" title="Reference documents" />
          <div className="mt-6 space-y-3">
            {[standard, marketReport].filter(Boolean).map((d) => (
              <a
                key={d!.id}
                href={d!.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary"
              >
                <div>
                  <p className="font-medium">{d!.title}</p>
                  <p className="text-xs uppercase text-muted-foreground">{d!.type}</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/downloads">Browse full download center</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
