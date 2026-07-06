"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { getSectorCountByCategory } from "@/lib/data";

export function CategoryCoverageChart({ data }: { data: ReturnType<typeof getSectorCountByCategory> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="category" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Total sectors" radius={[8, 8, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.categoryId} fill={d.color} />
          ))}
        </Bar>
        <Bar dataKey="available" name="Available for certification" radius={[8, 8, 0, 0]} fillOpacity={0.45}>
          {data.map((d) => (
            <Cell key={d.categoryId} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
