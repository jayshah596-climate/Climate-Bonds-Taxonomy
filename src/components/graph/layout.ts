import type { Category, Sector } from "@/lib/types";

export interface LaidOutNode {
  id: string;
  x: number;
  y: number;
}

const CATEGORY_RADIUS = 620;
const SECTOR_RADIUS = 240;

// Place each category at a compass point, then fan its sectors out in an arc
// facing away from the centre so the graph reads as four clear clusters.
export function layoutGraph(categories: Category[], sectors: Sector[]): LaidOutNode[] {
  const nodes: LaidOutNode[] = [];
  const angleStep = (2 * Math.PI) / categories.length;

  categories.forEach((category, i) => {
    const centerAngle = i * angleStep - Math.PI / 2;
    const cx = Math.cos(centerAngle) * CATEGORY_RADIUS;
    const cy = Math.sin(centerAngle) * CATEGORY_RADIUS;
    nodes.push({ id: `category:${category.id}`, x: cx, y: cy });

    const sectorsInCategory = sectors.filter((s) => s.categoryId === category.id);
    const arcSpan = Math.PI * 0.85;
    sectorsInCategory.forEach((sector, j) => {
      const t = sectorsInCategory.length === 1 ? 0.5 : j / (sectorsInCategory.length - 1);
      const angle = centerAngle - arcSpan / 2 + t * arcSpan;
      const sx = cx + Math.cos(angle) * SECTOR_RADIUS;
      const sy = cy + Math.sin(angle) * SECTOR_RADIUS;
      nodes.push({ id: `sector:${sector.id}`, x: sx, y: sy });
    });
  });

  return nodes;
}
