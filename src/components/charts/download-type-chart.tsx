"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { getDownloadTypeBreakdown } from "@/lib/data";

export function DownloadTypeChart({ data }: { data: ReturnType<typeof getDownloadTypeBreakdown> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="type"
          width={56}
          tickFormatter={(v) => String(v).toUpperCase()}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="var(--primary)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
