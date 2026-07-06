import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { DownloadCenter } from "@/components/downloads/download-center";
import { getDownloads } from "@/lib/data";

export const metadata: Metadata = {
  title: "Download Center",
  description: "Search and preview every indexed Climate Bonds criteria document, methodology, report and guide.",
};

export default function DownloadsPage() {
  const downloads = getDownloads();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Download Center" }]}
        title="Download Center"
        description="Every criteria document, methodology, report and guide indexed from climatebonds.net — searchable, filterable, and previewable in-browser."
        showPrint={false}
      />
      <Section>
        <Suspense fallback={null}>
          <DownloadCenter downloads={downloads} />
        </Suspense>
      </Section>
    </>
  );
}
