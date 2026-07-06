"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCommandPalette } from "@/components/search/command-palette";

const floatingBadges = [
  { label: "Mitigation", top: "8%", left: "6%", delay: 0, color: "#10b981" },
  { label: "Resilience", top: "18%", left: "78%", delay: 0.4, color: "#3b82f6" },
  { label: "Blue", top: "62%", left: "84%", delay: 0.8, color: "#22d3ee" },
  { label: "Methane", top: "72%", left: "10%", delay: 1.2, color: "#fb923c" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <Sparkles className="size-3.5 text-primary" />
            Independent knowledge platform · not affiliated with Climate Bonds Initiative
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Climate Bonds Taxonomy{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Explorer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg text-muted-foreground"
          >
            Explore every Climate Bonds Taxonomy pathway, certification criteria, sector guidance, resilience
            framework, and sustainable finance opportunity from one interactive platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" asChild className="gap-2">
              <Link href="/taxonomy">
                Explore Taxonomy <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link href="/certification">
                <Compass className="size-4" /> Browse Criteria
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="gap-2" onClick={openCommandPalette}>
              <Search className="size-4" /> Search
            </Button>
            <Button size="lg" variant="ghost" asChild className="gap-2">
              <Link href="/blog">Latest Updates</Link>
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-primary/30"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-8 rounded-full bg-[conic-gradient(from_140deg,#10b981,#22d3ee,#3b82f6,#fb923c,#10b981)] opacity-90 shadow-2xl"
          >
            <div className="absolute inset-[10%] rounded-full bg-background/90 backdrop-blur-sm" />
            <div className="absolute inset-[18%] overflow-hidden rounded-full">
              <div className="size-full animate-drift bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.35),transparent_45%),radial-gradient(circle_at_50%_85%,rgba(34,211,238,0.3),transparent_40%)]" />
            </div>
          </motion.div>
          {floatingBadges.map((b) => (
            <motion.div
              key={b.label}
              className="absolute animate-float rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold shadow-lg"
              style={{ top: b.top, left: b.left, animationDelay: `${b.delay}s` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + b.delay * 0.2, duration: 0.5 }}
            >
              <span className="mr-1.5 inline-block size-2 rounded-full" style={{ background: b.color }} />
              {b.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
