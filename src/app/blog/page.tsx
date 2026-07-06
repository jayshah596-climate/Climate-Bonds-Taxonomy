import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/ui/badge";
import { getBlogs, getCategory } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & Updates",
  description: "The latest Climate Bonds taxonomy updates, sector insights, methodologies and announcements.",
};

export default function BlogPage() {
  const blogs = getBlogs();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Blog & Updates" }]}
        title="Blog & Updates"
        description="Curated from the official Climate Bonds news hub — taxonomy updates, sector insights, methodologies and announcements."
      />
      <Section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {blogs.map((b) => {
            const category = b.categoryIds[0] ? getCategory(b.categoryIds[0]) : undefined;
            return (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" /> {formatDate(b.publishedDate)}
                  </span>
                  {category && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: category.theme.primary }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-primary">{b.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{b.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Read on climatebonds.net <ExternalLink className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
