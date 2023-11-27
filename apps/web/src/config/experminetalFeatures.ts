export enum EXPERIMENTAL_FEATURES {
  WebNotifications = 'web-notifications',
}

export type FeatureRollOutConfig = {
  feature: EXPERIMENTAL_FEATURES
  percentage: number // For user, the roll out percentage is more intuitive and easy to understand. "coverage" may also be a good choice?
  whitelist: string[] // Reason for this suggestion is, the user identifier is not necessarily to be the ip. We may switch to use things like device id or uuid to do the ab testing in the future
}

export type ExperimentalFeatureMpa = {
  [flag in EXPERIMENTAL_FEATURES]: FeatureRollOutConfig
}
// Add new AB TESTS here aswell as their config
export const EXPERIMENTAL_FEATURE_FLAG_MAP: ExperimentalFeatureMpa = {
  [EXPERIMENTAL_FEATURES.WebNotifications]: {
    feature: EXPERIMENTAL_FEATURES.WebNotifications,
    percentage: 0.05,
    whitelist: [],
  },
}
