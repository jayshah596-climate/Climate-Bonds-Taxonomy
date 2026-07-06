"use client";

import dynamic from "next/dynamic";

export const WorldMap = dynamic(() => import("@/components/map/world-map").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => <div className="h-[70vh] w-full animate-pulse rounded-3xl bg-secondary/40" />,
});
