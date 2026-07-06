"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles, Bookmark, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { primaryNav, roleNav, resourceNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { openCommandPalette } from "@/components/search/command-palette";
import { useAppStore } from "@/lib/store";

export function Header() {
  const pathname = usePathname();
  const bookmarkCount = useAppStore((s) => s.bookmarks.length);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <span className="hidden sm:inline">Climate Bonds Taxonomy Explorer</span>
          <span className="sm:hidden">CBTE</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname.startsWith(item.href) && "bg-secondary text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full px-3.5 text-sm font-medium text-muted-foreground">
                For You
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {roleNav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full px-3.5 text-sm font-medium text-muted-foreground">
                Resources
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Resources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {resourceNav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex flex-col items-start gap-0.5">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 text-muted-foreground sm:flex"
            onClick={openCommandPalette}
          >
            <Search className="size-3.5" />
            Search
            <kbd className="rounded border border-border bg-background px-1 text-[10px]">⌘K</kbd>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={openCommandPalette} aria-label="Search">
            <Search />
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Bookmarks">
            <Link href="/bookmarks" className="relative">
              <Bookmark />
              {bookmarkCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </Button>
          <ThemeToggle />
          <Button
            size="sm"
            className="hidden gap-1.5 md:flex"
            onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
          >
            <Sparkles className="size-3.5" />
            Ask AI
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1">
                {[...primaryNav, ...roleNav, ...resourceNav].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
