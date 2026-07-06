import { Section, SectionHeading } from "@/components/common/section";
import { cn } from "@/lib/utils";

const milestones = [
  { year: "2012", title: "Taxonomy pioneered", description: "Climate Bonds Initiative creates the first science-based taxonomy defining Paris-aligned assets." },
  { year: "2019", title: "Climate Bonds Standard v3", description: "Certification scheme matures with expanded sector criteria and Approved Verifier network." },
  { year: "2021", title: "Taxonomy Tables published", description: "Full sector-by-sector eligibility tables released, covering energy through ICT." },
  { year: "2023", title: "Buildings Criteria updated", description: "December 2023 update aligns Buildings Criteria with the EU Taxonomy's substantial-contribution tests." },
  { year: "2024", title: "Steel Criteria launched", description: "First heavy-industry criteria published, opening certification to hard-to-abate steelmaking." },
  { year: "2025", title: "Standard v4.3 & Resilience Taxonomy", description: "Resilience Certification launches after public consultation — the first global adaptation taxonomy of its kind." },
  { year: "2026", title: "CONNECT 2026 taxonomy update", description: "Climate Bonds unveils its biggest taxonomy update in years alongside a new interactive platform, integrating resilience alongside mitigation for the first time." },
];

export function Timeline() {
  return (
    <Section className="bg-secondary/30">
      <SectionHeading
        eyebrow="Interactive Timeline"
        title="How the taxonomy evolved"
        description="From a single mitigation framework to an integrated Mitigation, Resilience, Blue and Methane system."
      />
      <div className="relative mx-auto mt-12 max-w-3xl">
        <div className="absolute left-[27px] top-0 h-full w-px bg-border sm:left-1/2" />
        <div className="space-y-8">
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={cn(
                "relative flex gap-6 sm:items-center",
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              )}
            >
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-sm font-semibold shadow-sm sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                {m.year}
              </div>
              <div
                className={cn(
                  "ml-20 rounded-2xl border border-border bg-card p-5 shadow-sm sm:ml-0 sm:w-[calc(50%-2.5rem)]",
                  i % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto"
                )}
              >
                <h4 className="font-display font-semibold">{m.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
