import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink, FileText, Newspaper, HelpCircle, Network } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/common/bookmark-button";
import { CompareToggle } from "@/components/taxonomy/compare-toggle";
import { SectorStatusBadge } from "@/components/taxonomy/status-badge";
import {
  getSectors,
  getSector,
  getCategory,
  getRelatedSectors,
  getSectorDownloads,
  getSectorBlogs,
  getSectorFaqs,
  getCaseStudiesForSector,
} from "@/lib/data";
import { DynamicIcon } from "@/lib/icon-map";
import { formatDate } from "@/lib/utils";
import { jsonLdScript, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getSectors().map((s) => ({ category: s.categoryId, sector: s.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ category: string; sector: string }>;
}): Promise<Metadata> {
  const { sector: sectorId } = await props.params;
  const sector = getSector(sectorId);
  if (!sector) return {};
  return { title: sector.name, description: sector.description };
}

export default async function SectorPage(props: { params: Promise<{ category: string; sector: string }> }) {
  const { category: categoryId, sector: sectorId } = await props.params;
  const sector = getSector(sectorId);
  const category = getCategory(categoryId);
  if (!sector || !category || sector.categoryId !== category.id) notFound();

  const related = getRelatedSectors(sector);
  const downloads = getSectorDownloads(sector);
  const blogs = getSectorBlogs(sector);
  const faqs = getSectorFaqs(sector);
  const caseStudies = getCaseStudiesForSector(sector.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://climate-bonds-taxonomy-explorer.vercel.app";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Taxonomy Explorer", url: `${siteUrl}/taxonomy` },
            { name: category.name, url: `${siteUrl}/taxonomy/${category.id}` },
            { name: sector.name, url: `${siteUrl}/taxonomy/${category.id}/${sector.id}` },
          ])
        )}
      />
      <PageHeader
        crumbs={[
          { label: "Taxonomy Explorer", href: "/taxonomy" },
          { label: category.name, href: `/taxonomy/${category.id}` },
          { label: sector.shortName },
        ]}
        title={sector.name}
        description={sector.overview}
        badge={
          <span
            className="flex size-11 items-center justify-center rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${category.theme.from}, ${category.theme.to})` }}
          >
            <DynamicIcon name={sector.icon} className="size-5" />
          </span>
        }
      >
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <SectorStatusBadge status={sector.status} />
          <Badge variant="secondary">Last updated {formatDate(sector.lastUpdated)}</Badge>
          <BookmarkButton
            id={`sector:${sector.id}`}
            title={sector.name}
            href={`/taxonomy/${category.id}/${sector.id}`}
            type="sector"
          />
          <CompareToggle sectorId={sector.id} />
        </div>
      </PageHeader>

      <Section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Eligible Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {sector.eligibleActivities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {a}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {sector.technicalCriteria.map((c) => (
                  <li key={c} className="rounded-xl bg-secondary/60 px-4 py-2.5 text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{sector.certificationNotes}</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/certification">View full certification pathway</Link>
              </Button>
            </CardContent>
          </Card>

          {faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="size-4 text-primary" /> Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.id} id={f.id}>
                    <p className="font-medium">{f.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {caseStudies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Case Studies</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {caseStudies.map((cs) => (
                  <Link
                    key={cs.id}
                    href={`/case-studies/${cs.id}`}
                    className="rounded-xl border border-border p-4 text-sm hover:border-primary"
                  >
                    <p className="font-medium">{cs.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {cs.country} · {cs.bondSize}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="size-4 text-primary" /> Official Climate Bonds Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {sector.officialLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary"
                >
                  {l.label}
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>

          {downloads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" /> Downloads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {downloads.map((d) => (
                  <a
                    key={d.id}
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
                  >
                    <span className="font-medium">{d.title}</span>
                    <span className="mt-0.5 block text-xs uppercase text-muted-foreground">{d.type}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {blogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="size-4 text-primary" /> Related Blogs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {blogs.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    className="block rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
                  >
                    {b.title}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="size-4 text-primary" /> Related Sectors
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/taxonomy/${r.categoryId}/${r.id}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                  >
                    {r.shortName}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}
