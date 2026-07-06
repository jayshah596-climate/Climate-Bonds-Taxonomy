"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificationStage } from "@/lib/types";

export function CertificationPathway({ stages }: { stages: CertificationStage[] }) {
  const [active, setActive] = React.useState(stages[0]?.id);
  const activeStage = stages.find((s) => s.id === active) ?? stages[0];

  return (
    <div>
      <div className="scrollbar-thin flex items-center overflow-x-auto pb-2">
        {stages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <button onClick={() => setActive(stage.id)} className="flex shrink-0 flex-col items-center gap-2 px-2">
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-2 font-display text-sm font-semibold transition-all",
                  activeStage.id === stage.id
                    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-110"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60"
                )}
              >
                {stage.order}
              </span>
              <span
                className={cn(
                  "max-w-[6.5rem] text-center text-xs font-medium",
                  activeStage.id === stage.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stage.name}
              </span>
            </button>
            {i < stages.length - 1 && <span className="h-px w-8 shrink-0 bg-border sm:w-14" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-7 shadow-sm lg:grid-cols-2"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <FileCheck2 className="size-3.5" /> Stage {activeStage.order} of {stages.length}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold">{activeStage.name}</h3>
            <p className="mt-2 text-muted-foreground">{activeStage.description}</p>
            <a
              href={activeStage.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Official Climate Bonds guidance <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</h4>
              <ul className="mt-2 space-y-2">
                {activeStage.requirements.map((r) => (
                  <li key={r} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documents</h4>
              <ul className="mt-2 space-y-2">
                {activeStage.documents.map((d) => (
                  <li key={d} className="rounded-xl border border-dashed border-border px-3 py-2 text-sm">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
