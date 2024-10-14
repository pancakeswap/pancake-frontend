export enum EXPERIMENTAL_FEATURES {
  WebNotifications = 'web-notifications',
  SpeedQuote = 'routing-speed-quote',
  PriceAPI = 'price-api',
  PCSX = 'pcsx',
}

export type EnumValues<T> = T extends { [key: string]: infer U } ? U : never

export type FeatureKeys = EnumValues<typeof EXPERIMENTAL_FEATURES>[]

export const getCookieKey = (key: EXPERIMENTAL_FEATURES) => `p_exp_${key.toLowerCase()}`

export type FeatureRollOutConfig = {
  feature: EXPERIMENTAL_FEATURES
  percentage: number
  whitelist: string[]
}

export type ExperimentalFeatureConfigs = FeatureRollOutConfig[]

const readPercentage = (feature: EXPERIMENTAL_FEATURES): number => {
  const urlParams = new URLSearchParams(window.location.search)
  const urlValue = urlParams.get(`percentage_${feature}`)
  return urlValue ? parseFloat(urlValue) : 0 // Default to 0 if not found
}

// Add new AB TESTS here as well as their config
export const EXPERIMENTAL_FEATURE_CONFIGS: ExperimentalFeatureConfigs = [
  {
    feature: EXPERIMENTAL_FEATURES.WebNotifications,
    percentage: readPercentage(EXPERIMENTAL_FEATURES.WebNotifications) || 1,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.SpeedQuote,
    percentage: readPercentage(EXPERIMENTAL_FEATURES.SpeedQuote) || 1,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.PriceAPI,
    percentage: readPercentage(EXPERIMENTAL_FEATURES.PriceAPI) || 0.5,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.PCSX,
    percentage: readPercentage(EXPERIMENTAL_FEATURES.PCSX) || 1,
    whitelist: [],
  },
]
