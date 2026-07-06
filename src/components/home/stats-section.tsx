import { Layers, FileStack, ShieldCheck, Landmark, BookOpen } from "lucide-react";
import { getStats } from "@/lib/data";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { Section } from "@/components/common/section";

export function StatsSection() {
  const stats = getStats();
  const items = [
    { label: "Taxonomy Categories", value: stats.categories, icon: Layers },
    { label: "Sector Criteria Tracked", value: stats.sectors, icon: ShieldCheck },
    { label: "Certification Pathway Stages", value: stats.certificationStages, icon: Landmark },
    { label: "Indexed Documents", value: stats.downloads, icon: FileStack },
    { label: "Glossary & FAQ Entries", value: stats.glossaryTerms + stats.faqs, icon: BookOpen },
  ];

  return (
    <Section className="py-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-transform hover:-translate-y-1"
          >
            <item.icon className="mx-auto size-5 text-primary" />
            <div className="mt-2 font-display text-3xl font-semibold">
              <AnimatedCounter value={item.value} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
