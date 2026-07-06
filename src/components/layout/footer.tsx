import Link from "next/link";
import { Leaf, ExternalLink } from "lucide-react";
import { footerNav } from "@/lib/nav";
import { getStats } from "@/lib/data";

export function Footer() {
  const stats = getStats();
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-display font-semibold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="size-4" />
              </span>
              Climate Bonds Taxonomy Explorer
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An independent navigational layer over the Climate Bonds Initiative&apos;s taxonomy, standard and
              sector criteria — built to help issuers, investors and institutions find the right official guidance
              fast.
            </p>
            <a
              href="https://www.climatebonds.net/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Visit climatebonds.net <ExternalLink className="size-3.5" />
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              Index snapshot: {stats.sectors} sectors · {stats.downloads} documents · last curated{" "}
              {new Date(stats.lastCrawled).toLocaleDateString()}
            </p>
          </div>
          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group}>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</div>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-foreground/80 hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Not affiliated with or endorsed by the Climate Bonds Initiative. All criteria documents link to the
            official climatebonds.net source.
          </p>
          <p>© {new Date().getFullYear()} Climate Bonds Taxonomy Explorer</p>
        </div>
      </div>
    </footer>
  );
}
