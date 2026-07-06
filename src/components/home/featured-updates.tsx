import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { getBlogs, getCaseStudies } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/common/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FeaturedUpdates() {
  const blogs = getBlogs().slice(0, 3);
  const caseStudies = getCaseStudies().slice(0, 2);

  return (
    <Section>
      <SectionHeading
        eyebrow="Latest from Climate Bonds"
        title="Recent updates & featured issuance"
        description="Curated from the Climate Bonds news hub and Certified Bonds Database."
      />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Latest blog & taxonomy updates</h3>
          <div className="mt-4 space-y-4">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" /> {formatDate(b.publishedDate)}
                  </div>
                  <h4 className="mt-1.5 font-medium group-hover:text-primary">{b.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.summary}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/blog">View all updates</Link>
          </Button>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Featured certified issuance</h3>
          <div className="mt-4 space-y-4">
            {caseStudies.map((cs) => (
              <div key={cs.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{cs.country}</Badge>
                  <span className="text-xs text-muted-foreground">{cs.bondSize}</span>
                </div>
                <h4 className="mt-2 font-medium">{cs.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{cs.impact}</p>
                <a
                  href={cs.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View in Certified Bonds Database <ExternalLink className="size-3" />
                </a>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/case-studies">Browse all case studies</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
