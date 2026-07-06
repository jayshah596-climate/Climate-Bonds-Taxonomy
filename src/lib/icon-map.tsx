import {
  Flame,
  ShieldCheck,
  Waves,
  Wind,
  Zap,
  Building2,
  TrainFront,
  Factory,
  Recycle,
  Server,
  Wheat,
  Trees,
  Droplets,
  Atom,
  CircleDashed,
  Cog,
  Leaf,
  Building,
  Sprout,
  Landmark,
  Globe2,
  Anchor,
  Ship,
  Fish,
  Trash2,
  Beef,
  Mountain,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Flame,
  ShieldCheck,
  Waves,
  Wind,
  Zap,
  Building2,
  TrainFront,
  Factory,
  Recycle,
  Server,
  Wheat,
  Trees,
  Droplets,
  Atom,
  CircleDashed,
  Cog,
  Leaf,
  Building,
  Sprout,
  Landmark,
  Globe2,
  Anchor,
  Ship,
  Fish,
  Trash2,
  Beef,
  Mountain,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle;
}

/** Renders an icon looked up by name from the stable, module-level `iconMap`.
 * Centralised here so the "lookup then render" pattern (which the
 * react-hooks/static-components rule can't verify is a stable reference,
 * not a freshly created component) only needs justifying in one place. */
/* eslint-disable react-hooks/static-components -- iconMap entries are stable module-level references, not created per render */
export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = getIcon(name);
  return <Icon className={className} />;
}
/* eslint-enable react-hooks/static-components */
