"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  id,
  title,
  href,
  type,
  className,
}: {
  id: string;
  title: string;
  href: string;
  type: string;
  className?: string;
}) {
  const isBookmarked = useAppStore((s) => s.isBookmarked(id));
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={() => toggleBookmark({ id, title, href, type })}
    >
      {isBookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
      {isBookmarked ? "Saved" : "Save"}
    </Button>
  );
}
