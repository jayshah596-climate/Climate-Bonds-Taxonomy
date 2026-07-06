import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section, SectionHeading } from "@/components/common/section";
import { CertificationPathway } from "@/components/certification/pathway";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCertificationPathway, getFaqs, getDownload } from "@/lib/data";

export const metadata: Metadata = {
  title: "Issuer Hub",
  description: "The step-by-step Climate Bonds issuance workflow: eligibility, criteria selection, certification, verification, reporting.",
};

export default function IssuersPage() {
  const stages = getCertificationPathway();
  const faqs = getFaqs().filter((f) => ["faq-how-to-certify", "faq-certification-general"].includes(f.id));
  const sldGuide = getDownload("d-sld-guide");

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Issuer Hub" }]}
        title="Issuer Hub"
        description="Everything a bond issuer needs to plan a Climate Bonds Certified issuance: eligibility screening, criteria selection, verification, certification and post-issuance reporting."
      />

      <Section>
        <SectionHeading eyebrow="Issuance Workflow" title="Your certification journey, step by step" />
        <div className="mt-8">
          <CertificationPathway stages={stages} />
        </div>
      </Section>

      <Section className="pt-0 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Issuer FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((f) => (
              <div key={f.id}>
                <p className="font-medium">{f.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
            <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View full FAQ library <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sustainability-Linked Issuance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Issuing an SLB or SLL? Climate Bonds also certifies sustainability-linked debt instruments against KPI
              and Sustainability Performance Target quality benchmarks.
            </p>
            {sldGuide && (
              <a
                href={sldGuide.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                {sldGuide.title} <ExternalLink className="size-3.5" />
              </a>
            )}
          </CardContent>
        </Card>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-secondary/40 p-8">
          <div>
            <h3 className="font-display text-xl font-semibold">Not sure which Sector Criteria apply?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the full Taxonomy Explorer to find eligibility criteria for your asset class.
            </p>
          </div>
          <Button asChild>
            <Link href="/taxonomy">Open Taxonomy Explorer</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
