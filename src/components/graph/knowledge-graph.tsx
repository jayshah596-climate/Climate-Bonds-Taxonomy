"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
} from "reactflow";
import Link from "next/link";
import { ExternalLink, FileText, HelpCircle, Newspaper, X } from "lucide-react";
import { getCategories, getSectors, getSector, getSectorDownloads, getSectorBlogs, getSectorFaqs } from "@/lib/data";
import { layoutGraph } from "@/components/graph/layout";
import { CategoryNode, SectorNode } from "@/components/graph/nodes";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-map";

const nodeTypes: NodeTypes = { category: CategoryNode, sector: SectorNode };

function useGraphData(onSectorClick: (id: string) => void) {
  return React.useMemo(() => {
    const categories = getCategories();
    const sectors = getSectors();
    const positions = layoutGraph(categories, sectors);
    const posMap = new Map(positions.map((p) => [p.id, p]));

    const nodes: Node[] = [];
    for (const c of categories) {
      const pos = posMap.get(`category:${c.id}`)!;
      nodes.push({
        id: `category:${c.id}`,
        type: "category",
        position: { x: pos.x, y: pos.y },
        data: { label: c.name, categoryId: c.id, icon: c.icon },
        draggable: false,
      });
    }
    for (const s of sectors) {
      const pos = posMap.get(`sector:${s.id}`)!;
      nodes.push({
        id: `sector:${s.id}`,
        type: "sector",
        position: { x: pos.x, y: pos.y },
        data: { label: s.shortName, categoryId: s.categoryId, status: s.status, onClick: () => onSectorClick(s.id) },
        draggable: false,
      });
    }

    const edges: Edge[] = [];
    for (const s of sectors) {
      edges.push({
        id: `e-cat-${s.id}`,
        source: `category:${s.categoryId}`,
        target: `sector:${s.id}`,
        style: { stroke: "var(--border)" },
      });
      for (const rel of s.relatedSectorIds) {
        const id = [s.id, rel].sort().join("~");
        if (!edges.some((e) => e.id === `e-rel-${id}`)) {
          edges.push({
            id: `e-rel-${id}`,
            source: `sector:${s.id}`,
            target: `sector:${rel}`,
            style: { stroke: "var(--primary)", strokeDasharray: "3 3", opacity: 0.5 },
          });
        }
      }
    }

    return { nodes, edges };
  }, [onSectorClick]);
}

function SectorDetailPanel({ sectorId, onClose }: { sectorId: string; onClose: () => void }) {
  const sector = getSector(sectorId);
  if (!sector) return null;
  const downloads = getSectorDownloads(sector);
  const blogs = getSectorBlogs(sector);
  const faqs = getSectorFaqs(sector);

  return (
    <div className="absolute right-4 top-4 z-10 max-h-[calc(100%-2rem)] w-80 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl scrollbar-thin">
      <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-secondary">
        <X className="size-4" />
      </button>
      <div className="flex items-center gap-2">
        <DynamicIcon name={sector.icon} className="size-5 text-primary" />
        <h3 className="font-display font-semibold">{sector.name}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{sector.description}</p>
      <Link href={`/taxonomy/${sector.categoryId}/${sector.id}`}>
        <Button size="sm" className="mt-3 w-full">
          Open full sector page
        </Button>
      </Link>

      {sector.officialLinks.length > 0 && (
        <div className="mt-4">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <ExternalLink className="size-3.5" /> Official page
          </h4>
          <a
            href={sector.officialLinks[0].url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-sm text-primary hover:underline"
          >
            {sector.officialLinks[0].label}
          </a>
        </div>
      )}
      {downloads.length > 0 && (
        <div className="mt-4">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <FileText className="size-3.5" /> Downloads
          </h4>
          <ul className="mt-1 space-y-1">
            {downloads.slice(0, 3).map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {blogs.length > 0 && (
        <div className="mt-4">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <Newspaper className="size-3.5" /> Related blogs
          </h4>
          <ul className="mt-1 space-y-1">
            {blogs.map((b) => (
              <li key={b.id}>
                <Link href={`/blog/${b.slug}`} className="text-sm text-primary hover:underline">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {faqs.length > 0 && (
        <div className="mt-4">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <HelpCircle className="size-3.5" /> FAQ
          </h4>
          <p className="mt-1 text-sm">{faqs[0].question}</p>
          <p className="text-xs text-muted-foreground">{faqs[0].answer}</p>
        </div>
      )}
    </div>
  );
}

function GraphInner() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const { nodes, edges } = useGraphData(setSelected);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-border bg-secondary/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={28} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable className="!bg-card" />
      </ReactFlow>
      {selected && <SectorDetailPanel sectorId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export function KnowledgeGraph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
