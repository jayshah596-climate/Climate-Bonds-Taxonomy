import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Section } from "@/components/common/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/common/bookmark-button";
import { getBlogs, getBlogBySlug, getSector } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { jsonLdScript, articleJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getBlogs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  return { title: blog.title, description: blog.summary };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();
  const sectors = blog.sectorIds.map((s) => getSector(s)).filter(Boolean);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://climate-bonds-taxonomy-explorer.vercel.app";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleJsonLd({
            title: blog.title,
            description: blog.summary,
            url: `${siteUrl}/blog/${blog.slug}`,
            datePublished: blog.publishedDate,
          })
        )}
      />
      <PageHeader crumbs={[{ label: "Blog & Updates", href: "/blog" }, { label: blog.title }]} title={blog.title}>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="size-3.5" /> {formatDate(blog.publishedDate)}
          </span>
          {blog.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
          <BookmarkButton id={`blog:${blog.id}`} title={blog.title} href={`/blog/${blog.slug}`} type="blog" />
        </div>
      </PageHeader>
      <Section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{blog.summary}</p>
              <p>
                This explorer indexes and summarises official Climate Bonds Initiative content. Read the full article,
                with charts, quotes and complete detail, on the official site.
              </p>
              <Button asChild>
                <a href={blog.url} target="_blank" rel="noreferrer" className="gap-1.5">
                  Read full article on climatebonds.net <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        {sectors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Sectors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sectors.map(
                (s) =>
                  s && (
                    <Link
                      key={s.id}
                      href={`/taxonomy/${s.categoryId}/${s.id}`}
                      className="block rounded-xl border border-border px-3.5 py-2.5 text-sm hover:border-primary"
                    >
                      {s.name}
                    </Link>
                  )
              )}
            </CardContent>
          </Card>
        )}
      </Section>
    </>
  );
}
