import { type Crumb, Breadcrumbs } from "@/components/common/breadcrumbs";
import { PrintButton } from "@/components/common/print-button";
import { cn } from "@/lib/utils";

export function PageHeader({
  crumbs,
  title,
  description,
  badge,
  className,
  children,
  showPrint = true,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  showPrint?: boolean;
}) {
  return (
    <div className={cn("border-b border-border bg-secondary/30 bg-grid", className)}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumbs items={crumbs} />
          {showPrint && <PrintButton />}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {badge}
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        </div>
        {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
}
