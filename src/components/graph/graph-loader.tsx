"use client";

import dynamic from "next/dynamic";

export const KnowledgeGraph = dynamic(
  () => import("@/components/graph/knowledge-graph").then((m) => m.KnowledgeGraph),
  { ssr: false, loading: () => <div className="h-[70vh] w-full animate-pulse rounded-3xl bg-secondary/40" /> }
);
