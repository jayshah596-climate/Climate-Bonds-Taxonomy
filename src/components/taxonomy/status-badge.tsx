import { Badge } from "@/components/ui/badge";
import type { Sector } from "@/lib/types";

const labels: Record<Sector["status"], string> = {
  available: "Available for Certification",
  "in-development": "Criteria In Development",
  consultation: "In Public Consultation",
};

const variants: Record<Sector["status"], "success" | "warning" | "secondary"> = {
  available: "success",
  "in-development": "warning",
  consultation: "secondary",
};

export function SectorStatusBadge({ status }: { status: Sector["status"] }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
