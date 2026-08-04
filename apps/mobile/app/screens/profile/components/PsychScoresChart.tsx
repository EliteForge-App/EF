import Svg, { Circle, G } from "react-native-svg"
import { Text, XStack, YStack } from "tamagui"

import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

export interface PsychScoresChartProps {
  teamworkScore: number
  mindsetScore: number
  overallScore?: number
  compact?: boolean
}

const TEAMWORK_COLOR = "#7B68EE"
const MINDSET_COLOR = eliteForgeColors.orange

interface ArcGaugeProps {
  score: number
  label: string
  color: string
  size: number
}

function ArcGauge({ score, label, color, size }: ArcGaugeProps) {
  const strokeWidth = 6
  const width = size
  const radius = (width - strokeWidth) / 2 - 4
  const height = radius + strokeWidth + 10
  const centerX = width / 2
  const centerY = height - 4
  const halfArc = Math.PI * radius
  const fullCirc = 2 * Math.PI * radius
  const clampedScore = Math.max(0, Math.min(100, score))
  const progress = (clampedScore / 100) * halfArc

  return (
    <YStack alignItems="center" gap={6} flex={1}>
      <YStack width={width} height={height} alignItems="center" justifyContent="flex-end">
        <Svg width={width} height={height}>
          <G transform={`rotate(180, ${centerX}, ${centerY})`}>
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${halfArc} ${fullCirc}`}
              strokeLinecap="round"
            />
            {clampedScore > 0 && (
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${progress} ${fullCirc}`}
                strokeLinecap="round"
              />
            )}
          </G>
        </Svg>
        <Text position="absolute" bottom={0} style={{ color }} fontWeight="800" fontSize={20}>
          {clampedScore}
        </Text>
      </YStack>
      <Text
        color="rgba(255,255,255,0.65)"
        fontSize={11}
        fontWeight="700"
        textAlign="center"
        numberOfLines={2}
      >
        {label}
      </Text>
    </YStack>
  )
}

export function PsychScoresChart({
  teamworkScore,
  mindsetScore,
  overallScore,
  compact = false,
}: PsychScoresChartProps) {
  const gaugeSize = compact ? 88 : 104
  const computedOverall = overallScore ?? Math.round((teamworkScore + mindsetScore) / 2)

  return (
    <YStack gap={compact ? 10 : 12}>
      <XStack alignItems="flex-end" justifyContent="space-around" gap={8}>
        <ArcGauge
          score={teamworkScore}
          label={translate("profileScreen:psychTeamworkScore")}
          color={TEAMWORK_COLOR}
          size={gaugeSize}
        />
        <ArcGauge
          score={mindsetScore}
          label={translate("profileScreen:psychMindsetScore")}
          color={MINDSET_COLOR}
          size={gaugeSize}
        />
      </XStack>

      {!compact && (
        <XStack
          alignItems="center"
          justifyContent="center"
          gap={8}
          paddingVertical={8}
          borderRadius={10}
          backgroundColor="rgba(255,255,255,0.04)"
        >
          <Text color="rgba(255,255,255,0.5)" fontSize={11} fontWeight="600">
            {translate("profileScreen:psychOverallScore")}
          </Text>
          <Text color={eliteForgeColors.emerald} fontWeight="800" fontSize={15}>
            {computedOverall}/100
          </Text>
        </XStack>
      )}
    </YStack>
  )
}
