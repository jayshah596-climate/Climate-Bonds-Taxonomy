"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { getSectorStatusBreakdown } from "@/lib/data";

const COLORS: Record<string, string> = {
  available: "#10b981",
  "in-development": "#f59e0b",
  consultation: "#64748b",
};

const LABELS: Record<string, string> = {
  available: "Available",
  "in-development": "In development",
  consultation: "In consultation",
};

export function StatusPieChart({ data }: { data: ReturnType<typeof getSectorStatusBreakdown> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={60} outerRadius={95} paddingAngle={3}>
          {data.map((d) => (
            <Cell key={d.status} fill={COLORS[d.status] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
        />
        <Legend formatter={(value) => LABELS[value] ?? value} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
