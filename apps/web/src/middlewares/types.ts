import { FEATURE_FLAGS } from 'contexts/ABTestingContext/config'
import { NextMiddleware } from 'next/server'

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export type FeatureFlagInfo = {
  featureFlagKey: FEATURE_FLAGS
  probabilityThreshold: number
  whitelistedIps: string[]
}

export type AbTestingMap = {
  [flag in FEATURE_FLAGS]: FeatureFlagInfo
}
