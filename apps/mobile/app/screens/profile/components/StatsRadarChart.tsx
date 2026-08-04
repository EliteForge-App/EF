import { Fragment } from "react"
import { Pressable } from "react-native"
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg"
import { Text, XStack, YStack } from "tamagui"

import type { StatKey } from "@/data/mockPlayerProfile"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface RadarAxis {
  key?: StatKey
  label: string
  value: number
  hasResult?: boolean
}

export interface StatsRadarChartProps {
  data: RadarAxis[]
  size?: number
  onStatPress?: (statKey: StatKey) => void
}

function polarPoint(
  center: number,
  radius: number,
  index: number,
  total: number,
  scale = 1,
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const distance = radius * scale
  return {
    x: center + distance * Math.cos(angle),
    y: center + distance * Math.sin(angle),
  }
}

function buildPolygonPoints(center: number, radius: number, data: RadarAxis[]): string {
  return data
    .map((item, index) => {
      const point = polarPoint(center, radius, index, data.length, item.value / 100)
      return `${point.x},${point.y}`
    })
    .join(" ")
}

export function StatsRadarChart({ data, size = 280, onStatPress }: StatsRadarChartProps) {
  const center = size / 2
  const radius = size * 0.34
  const count = data.length
  const measured = data.filter((item) => item.hasResult ?? item.value > 0)
  const average =
    measured.length > 0
      ? Math.round(measured.reduce((sum, item) => sum + item.value, 0) / measured.length)
      : 0

  const dataPolygon = buildPolygonPoints(center, radius, data)

  return (
    <YStack alignItems="center" gap={16}>
      <YStack
        width={size}
        height={size}
        position="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Svg width={size} height={size}>
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <Circle
              key={level}
              cx={center}
              cy={center}
              r={radius * level}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              fill="none"
            />
          ))}

          {data.map((_, index) => {
            const axisEnd = polarPoint(center, radius, index, count, 1)
            return (
              <Line
                key={`axis-${index}`}
                x1={center}
                y1={center}
                x2={axisEnd.x}
                y2={axisEnd.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            )
          })}

          {measured.length > 0 && (
            <Polygon
              points={dataPolygon}
              fill="rgba(0,206,200,0.22)"
              stroke={eliteForgeColors.emerald}
              strokeWidth={2}
            />
          )}

          {data.map((item, index) => {
            const valuePoint = polarPoint(center, radius, index, count, item.value / 100)
            const labelPoint = polarPoint(center, radius, index, count, 1.22)
            const hasValue = item.hasResult ?? item.value > 0
            const dotColor = index % 2 === 0 ? eliteForgeColors.emerald : eliteForgeColors.orange

            return (
              <Fragment key={item.label}>
                {hasValue && <Circle cx={valuePoint.x} cy={valuePoint.y} r={5} fill={dotColor} />}
                <SvgText
                  x={labelPoint.x}
                  y={labelPoint.y}
                  fill="rgba(255,255,255,0.85)"
                  fontSize={10}
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {item.label}
                </SvgText>
              </Fragment>
            )
          })}
        </Svg>

        <YStack
          position="absolute"
          alignItems="center"
          justifyContent="center"
          width={88}
          height={88}
          borderRadius={9999}
          backgroundColor="rgba(0,0,0,0.25)"
          borderWidth={1}
          borderColor="rgba(0,206,200,0.35)"
          pointerEvents="none"
        >
          <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={24}>
            {average}
          </Text>
          <Text color="rgba(255,255,255,0.55)" fontSize={10} fontWeight="700">
            AVG
          </Text>
        </YStack>
      </YStack>

      <YStack width="100%" gap={6} paddingHorizontal={4}>
        {data.map((item) => {
          const row = (
            <YStack gap={4}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text color="rgba(255,255,255,0.75)" fontSize={12} fontWeight="600">
                  {item.label}
                </Text>
                <Text color={eliteForgeColors.emerald} fontSize={12} fontWeight="800">
                  {item.hasResult || item.value > 0 ? item.value : "—"}
                </Text>
              </XStack>
              <YStack
                height={6}
                borderRadius={999}
                backgroundColor="rgba(255,255,255,0.08)"
                overflow="hidden"
              >
                <YStack
                  height="100%"
                  width={`${item.value}%`}
                  backgroundColor={eliteForgeColors.emerald}
                  borderRadius={999}
                />
              </YStack>
            </YStack>
          )

          if (item.key && onStatPress) {
            return (
              <Pressable
                key={item.label}
                onPress={() => onStatPress(item.key!)}
                accessibilityRole="button"
              >
                {row}
              </Pressable>
            )
          }

          return <YStack key={item.label}>{row}</YStack>
        })}
      </YStack>
    </YStack>
  )
}
