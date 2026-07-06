import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/common/bookmark-button";
import { getCaseStudies, getCaseStudy, getSector } from "@/lib/data";

export function generateStaticParams() {
  return getCaseStudies().map((cs) => ({ id: cs.id }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const cs = getCaseStudy(id);
  if (!cs) return {};
  return { title: cs.title, description: cs.impact };
}

export default async function CaseStudyPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const cs = getCaseStudy(id);
  if (!cs) notFound();
  const sectors = cs.sectorIds.map((s) => getSector(s)).filter(Boolean);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Case Studies", href: "/case-studies" }, { label: cs.title }]}
        title={cs.title}
        description={cs.impact}
      >
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary">{cs.country}</Badge>
          <Badge variant="outline">{cs.region}</Badge>
          <Badge variant="success">{cs.bondSize}</Badge>
          <BookmarkButton id={`casestudy:${cs.id}`} title={cs.title} href={`/case-studies/${cs.id}`} type="casestudy" />
        </div>
      </PageHeader>
      <Section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{cs.impact}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lessons for other issuers</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{cs.lessons}</CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certified under</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sectors.map(
                (s) =>
                  s && (
                    <Link
                      key={s.id}
                      href={`/taxonomy/${s.categoryId}/${s.id}`}
                      className="block rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
                    >
                      {s.name}
                    </Link>
                  )
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={cs.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Climate Bonds Certified Bonds Database <ExternalLink className="size-3.5" />
              </a>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
