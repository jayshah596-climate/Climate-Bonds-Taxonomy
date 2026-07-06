import { Handle, Position } from "reactflow";
import { DynamicIcon } from "@/lib/icon-map";
import { getCategory } from "@/lib/data";
import type { CategoryId } from "@/lib/types";

export function CategoryNode({ data }: { data: { label: string; categoryId: CategoryId; icon: string } }) {
  const category = getCategory(data.categoryId);
  if (!category) return null;
  return (
    <div
      className="flex min-w-[10rem] items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
      style={{ background: `linear-gradient(135deg, ${category.theme.from}, ${category.theme.to})` }}
    >
      <Handle type="source" position={Position.Top} className="!opacity-0" />
      <Handle type="target" position={Position.Bottom} className="!opacity-0" />
      <DynamicIcon name={data.icon} className="size-4 shrink-0" />
      {data.label}
    </div>
  );
}

export function SectorNode({
  data,
}: {
  data: { label: string; categoryId: CategoryId; status: string; onClick: () => void };
}) {
  const category = getCategory(data.categoryId);
  if (!category) return null;
  return (
    <button
      onClick={data.onClick}
      className="max-w-[10rem] rounded-xl border bg-card px-3 py-2 text-left text-xs font-medium shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: category.theme.primary }}
    >
      <Handle type="source" position={Position.Top} className="!opacity-0" />
      <Handle type="target" position={Position.Bottom} className="!opacity-0" />
      <span className="line-clamp-2">{data.label}</span>
      {data.status !== "available" && (
        <span className="mt-1 block text-[9px] uppercase tracking-wide text-muted-foreground">In development</span>
      )}
    </button>
  );
}
