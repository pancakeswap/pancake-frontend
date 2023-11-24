import { NextMiddleware } from 'next/server'

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export enum FEATURE_FLAGS {
  WebNotifications = 'web-notifications-feature-flag',
}

export type FeatureFlagInfo = { featureFlagKey: FEATURE_FLAGS; probabilityThreshold: number }

export type AbTestingMap = {
  [flag in FEATURE_FLAGS]: FeatureFlagInfo
}
