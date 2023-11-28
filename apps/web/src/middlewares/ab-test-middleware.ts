import {
  EXPERIMENTAL_FEATURE_CONFIGS,
  FeatureRollOutConfig,
  ctxKey,
  ExperimentalFeatureConfigs,
  EXPERIMENTAL_FEATURES,
} from 'config/experminetalFeatures'
import CryptoJS from 'crypto-js'
import { NextFetchEvent, NextMiddleware, NextResponse } from 'next/server'
import { MiddlewareFactory, ExtendedNextReq } from './types'

// this function generates a deterministic result for a user for a given feature
// it hashes a concatination of the users ip together with the features identifier and
// probanility value. this allows us to ensure that a users probability result is different
// for each feature gauranteeing a better distribution
export const getExperimentalFeatureAccessList = (
  userIdentifier: string,
  abTestingfeatureFlagInfo: ExperimentalFeatureConfigs,
): Array<{ feature: EXPERIMENTAL_FEATURES; hasAccess: boolean }> => {
  const userWhitelistResults = abTestingfeatureFlagInfo.map(
    (flag: FeatureRollOutConfig): { feature: EXPERIMENTAL_FEATURES; hasAccess: boolean } => {
      if (flag.whitelist.includes(userIdentifier)) return { feature: flag.feature, hasAccess: true }

      const hash = CryptoJS.SHA256(`${userIdentifier}-${flag.feature}-${flag.percentage}`)
      const hashHex = hash.toString(CryptoJS.enc.Hex)
      const lastByte = parseInt(hashHex.slice(-2), 16) / 255

      return { feature: flag.feature, hasAccess: lastByte <= flag.percentage }
    },
  )
  return userWhitelistResults
}

export const withABTesting: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    const ip = request.userIp
    const response = (await next(request, _next)) as NextResponse
    if (!ip) return response

    const accessList = getExperimentalFeatureAccessList(ip, EXPERIMENTAL_FEATURE_CONFIGS)
    for (const { feature, hasAccess } of accessList) {
      response.cookies.set(ctxKey(feature), hasAccess.toString())
    }
    return response
  }
}
