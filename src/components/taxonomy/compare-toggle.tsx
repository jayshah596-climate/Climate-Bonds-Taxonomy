"use client";

import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CompareToggle({ sectorId }: { sectorId: string }) {
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const active = compareList.includes(sectorId);

  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn("gap-1.5")}
      onClick={() => toggleCompare(sectorId)}
      disabled={!active && compareList.length >= 4}
    >
      <Scale className="size-3.5" />
      {active ? "In compare" : "Compare"}
    </Button>
  );
}
