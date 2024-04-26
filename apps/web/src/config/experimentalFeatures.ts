export enum EXPERIMENTAL_FEATURES {
  WebNotifications = 'web-notifications',
  SpeedQuote = 'routing-speed-quote',
  UniversalRouter = 'universal-router',
  PriceAPI = 'price-api',
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

// Add new AB TESTS here aswell as their config
export const EXPERIMENTAL_FEATURE_CONFIGS: ExperimentalFeatureConfigs = [
  {
    feature: EXPERIMENTAL_FEATURES.WebNotifications,
    percentage: 1,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.SpeedQuote,
    percentage: 0.6,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.UniversalRouter,
    percentage: 0.6,
    whitelist: [],
  },
  {
    feature: EXPERIMENTAL_FEATURES.PriceAPI,
    percentage: 0.05,
    whitelist: [],
  },
]
