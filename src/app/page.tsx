import { Hero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { Timeline } from "@/components/home/timeline";
import { FeaturedUpdates } from "@/components/home/featured-updates";
import { jsonLdScript, organizationJsonLd } from "@/lib/seo";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://climate-bonds-taxonomy-explorer.vercel.app";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd(siteUrl))} />
      <Hero />
      <StatsSection />
      <CategoryGrid />
      <Timeline />
      <FeaturedUpdates />
    </>
  );
}
