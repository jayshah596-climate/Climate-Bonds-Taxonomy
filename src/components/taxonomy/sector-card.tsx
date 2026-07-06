import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DynamicIcon } from "@/lib/icon-map";
import { SectorStatusBadge } from "@/components/taxonomy/status-badge";
import type { Category, Sector } from "@/lib/types";

export function SectorCard({ sector, category }: { sector: Sector; category: Category }) {
  return (
    <Link
      href={`/taxonomy/${category.id}/${sector.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex size-11 items-center justify-center rounded-xl text-white"
          style={{ background: `linear-gradient(135deg, ${category.theme.from}, ${category.theme.to})` }}
        >
          <DynamicIcon name={sector.icon} className="size-5" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
      <h3 className="mt-4 font-display font-semibold leading-snug">{sector.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{sector.description}</p>
      <div className="mt-4">
        <SectorStatusBadge status={sector.status} />
      </div>
    </Link>
  );
}
