import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryCoverageChart } from "@/components/charts/category-coverage-chart";
import { StatusPieChart } from "@/components/charts/status-pie-chart";
import { DownloadTypeChart } from "@/components/charts/download-type-chart";
import {
  getStats,
  getSectorCountByCategory,
  getSectorStatusBreakdown,
  getDownloadTypeBreakdown,
  getMostReferencedDownloads,
  getRecentUpdates,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Coverage, certification status and document analytics across the indexed Climate Bonds Taxonomy.",
};

export default function AnalyticsPage() {
  const stats = getStats();
  const coverage = getSectorCountByCategory();
  const statusBreakdown = getSectorStatusBreakdown();
  const downloadTypes = getDownloadTypeBreakdown();
  const topDownloads = getMostReferencedDownloads();
  const recentUpdates = getRecentUpdates(6);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Analytics" }]}
        title="Analytics"
        description="Structural coverage of the indexed taxonomy — derived directly from the curated knowledge base, refreshed whenever the index is recrawled."
        showPrint={false}
      />
      <Section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Sectors tracked", value: stats.sectors },
          { label: "Available for certification", value: stats.sectorsAvailable },
          { label: "Indexed documents", value: stats.downloads },
          { label: "Case studies", value: stats.caseStudies },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="font-display text-2xl font-semibold">{s.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </Section>

      <Section className="pt-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sector coverage by taxonomy</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryCoverageChart data={coverage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Certification status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={statusBreakdown} />
          </CardContent>
        </Card>
      </Section>

      <Section className="pt-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documents by type</CardTitle>
          </CardHeader>
          <CardContent>
            <DownloadTypeChart data={downloadTypes} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most-referenced criteria documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {topDownloads.map(({ download, count }) => (
              <a
                key={download.id}
                href={download.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
              >
                <span className="truncate">{download.title}</span>
                <Badge variant="secondary">{count} refs</Badge>
              </a>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section className="pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Newest criteria updates</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentUpdates.map((s) => (
              <Link
                key={s.id}
                href={`/taxonomy/${s.categoryId}/${s.id}`}
                className="rounded-xl border border-border px-4 py-3 text-sm hover:border-primary"
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">Updated {formatDate(s.lastUpdated)}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
