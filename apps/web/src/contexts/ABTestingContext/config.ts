import { AbTestingMap } from 'middleware/types'

export enum FEATURE_FLAGS {
  WebNotifications = 'web-notifications-feature-flag',
}

// Add new AB TESTS here aswell as their config
export const AB_TESTING_FEATURE_FLAG_MAP: AbTestingMap = {
  [FEATURE_FLAGS.WebNotifications]: {
    featureFlagKey: FEATURE_FLAGS.WebNotifications,
    probabilityThreshold: 0.05,
    whitelistedIps: [],
  },
}
