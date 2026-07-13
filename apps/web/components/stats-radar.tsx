'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

type StatData = { stat: string; value: number }

export function StatsRadar({
  data,
  height = 220,
}: {
  data: StatData[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="oklch(0.4 0.05 285)" />
        <PolarAngleAxis
          dataKey="stat"
          tick={{ fill: 'oklch(0.75 0.03 285)', fontSize: 11 }}
        />
        <Radar
          dataKey="value"
          stroke="oklch(0.86 0.24 145)"
          fill="oklch(0.86 0.24 145)"
          fillOpacity={0.4}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
