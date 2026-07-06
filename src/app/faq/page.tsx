import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { getFaqs } from "@/lib/data";
import { jsonLdScript, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about the Climate Bonds Taxonomy, Sector Criteria and Certification.",
};

export default function FaqPage() {
  const faqs = getFaqs();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(faqs))} />
      <PageHeader
        crumbs={[{ label: "FAQ" }]}
        title="Frequently Asked Questions"
        description="Common questions about eligibility, certification and the difference between Mitigation, Resilience, Blue and Methane pathways."
      />
      <Section>
        <FaqAccordion faqs={faqs} />
      </Section>
    </>
  );
}
