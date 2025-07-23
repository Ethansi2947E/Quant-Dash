"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = {
  "Winning Trades": "#10b981",
  "Losing Trades": "#ef4444",
} as const; // Use 'as const' to make keys specific

interface ChartData {
  name: keyof typeof COLORS; // Ensure name is one of the keys in COLORS
  value: number;
}

export function WinLossChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }
  
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number, name: string) => [
              `${value} trades (${((value / totalValue) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
