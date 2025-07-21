"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Mock data for win/loss chart
const winLossData = [
  { name: "Winning Trades", value: 167, color: "#10b981" },
  { name: "Losing Trades", value: 78, color: "#ef4444" },
]

export function WinLossChart() {
  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={winLossData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => (
              <text
                x={0}
                y={0}
                fill="white"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {`${name}: ${(percent * 100).toFixed(1)}%`}
              </text>
            )}
            labelLine={false}
          >
            {winLossData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "0.375rem",
            }}
            formatter={(value: number, name: string) => [
              `${value} trades (${((value / 245) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
