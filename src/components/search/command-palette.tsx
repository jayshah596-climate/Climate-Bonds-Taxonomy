"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search as SearchIcon, FileText, Layers, Newspaper, MapPin, HelpCircle, Library } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { search, type SearchItemType } from "@/lib/search";
import { useAppStore } from "@/lib/store";

const typeIcon: Record<SearchItemType, React.ElementType> = {
  category: Layers,
  sector: Layers,
  download: FileText,
  blog: Newspaper,
  casestudy: MapPin,
  faq: HelpCircle,
  glossary: Library,
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const pushHistory = useAppStore((s) => s.pushHistory);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", onOpen);
    return () => window.removeEventListener("open-command-palette", onOpen);
  }, []);

  const results = React.useMemo(() => (query ? search(query, { limit: 20 }) : []), [query]);

  function go(href: string, title: string) {
    setOpen(false);
    setQuery("");
    pushHistory({ href, title });
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent hideClose className="top-[16%] max-w-xl translate-y-0 p-0 overflow-hidden">
        <Command shouldFilter={false} className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <SearchIcon className="size-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search sectors, criteria, downloads, blogs, case studies…"
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
            {query && results.length === 0 && (
              <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
                No results for “{query}”. Try “solar”, “buildings”, or “certification”.
              </Command.Empty>
            )}
            {!query && (
              <div className="p-4 text-xs text-muted-foreground">
                Try: <span className="text-foreground">is solar eligible</span>,{" "}
                <span className="text-foreground">buildings criteria</span>,{" "}
                <span className="text-foreground">methane abatement</span>
              </div>
            )}
            {results.map((r) => {
              const Icon = typeIcon[r.type];
              return (
                <Command.Item
                  key={r.id}
                  value={r.id}
                  onSelect={() => go(r.href, r.title)}
                  className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-secondary"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{r.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.description}</div>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {r.type}
                  </span>
                </Command.Item>
              );
            })}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new Event("open-command-palette"));
}
