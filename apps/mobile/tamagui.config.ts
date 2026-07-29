import { defaultConfig } from "@tamagui/config/v5"
import { animationsReanimated } from "@tamagui/config/v5-reanimated"
import { createTamagui } from "tamagui"

import { eliteForgeColors } from "./app/theme/eliteForgeColors"

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  animations: animationsReanimated,
  tokens: {
    ...defaultConfig.tokens,
    // v5 defaultConfig no incluye tokens.color; se definen aquí como fallback de temas.
    color: {
      efEmerald: eliteForgeColors.emerald,
      efOrange: eliteForgeColors.orange,
      efCarbon: eliteForgeColors.carbon,
      efWhite: eliteForgeColors.white,
      efCarbonElevated: eliteForgeColors.carbonElevated,
      efCarbonBorder: eliteForgeColors.carbonBorder,
      efCarbonInput: eliteForgeColors.carbonInput,
      efMutedSurface: eliteForgeColors.mutedSurface,
    },
  },
  settings: {
    ...defaultConfig.settings,
    // Restaura longhands (backgroundColor, borderRadius, etc.) usados en la app.
    onlyAllowShorthands: false,
    styleCompat: "legacy",
  },
  themes: {
    ...defaultConfig.themes,
    dark: {
      ...defaultConfig.themes.dark,
      background: eliteForgeColors.carbon,
      backgroundHover: eliteForgeColors.carbonElevated,
      color: eliteForgeColors.white,
    },
    light: {
      ...defaultConfig.themes.light,
      background: eliteForgeColors.carbon,
      color: eliteForgeColors.white,
    },
  },
})

export type Conf = typeof tamaguiConfig

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
