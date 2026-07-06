import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/ui/badge";
import { getCaseStudies, getCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real Climate Bonds Certified issuance from the Certified Bonds Database, mapped to sector criteria.",
};

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Case Studies" }]}
        title="Case Studies"
        description="Verified, Certified issuance sourced from the Climate Bonds Certified Bonds Database — mapped to the sector criteria they were certified against."
      />
      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => {
            const category = getCategory(cs.categoryIds[0]);
            return (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.id}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="size-3" /> {cs.country}
                  </Badge>
                  {category && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: category.theme.primary }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display font-semibold group-hover:text-primary">{cs.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cs.bondSize}</p>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{cs.impact}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  View details <ExternalLink className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
