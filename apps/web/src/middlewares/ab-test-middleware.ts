import {
  EXPERIMENTAL_FEATURE_CONFIGS,
  FeatureRollOutConfig,
  getCookieKey,
  ExperimentalFeatureConfigs,
  EXPERIMENTAL_FEATURES,
} from 'config/experminetalFeatures'
import { NextFetchEvent, NextResponse } from 'next/server'
import { MiddlewareFactory, ExtendedNextReq, NextMiddleware } from './types'

// this function generates a deterministic result for a user for a given feature
// it hashes a concatination of the users ip together with the features identifier and
// probanility value. this allows us to ensure that a users probability result is different
// for each feature gauranteeing a better distribution
export const getExperimentalFeatureAccessList = async (
  userIdentifier: string,
  abTestingfeatureFlagInfo: ExperimentalFeatureConfigs,
): Promise<Array<{ feature: EXPERIMENTAL_FEATURES; hasAccess: boolean }>> => {
  const userWhitelistResults = await Promise.all(
    abTestingfeatureFlagInfo.map(
      async (flag: FeatureRollOutConfig): Promise<{ feature: EXPERIMENTAL_FEATURES; hasAccess: boolean }> => {
        if (flag.whitelist.includes(userIdentifier)) return { feature: flag.feature, hasAccess: true }
        const msgBuffer = new TextEncoder().encode(`${userIdentifier}-${flag.feature}`)
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
        const bufferArray = new Uint8Array(hashBuffer)
        const lastByte = bufferArray[bufferArray.length - 1]

        return { feature: flag.feature, hasAccess: lastByte <= flag.percentage * 0xff }
      },
    ),
  )
  return userWhitelistResults
}

export const withABTesting: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    const ip = request.userIp

    if (!ip) return next(request, _next)

    const response = (await next(request, _next)) || NextResponse.next()

    const accessList = await getExperimentalFeatureAccessList(ip, EXPERIMENTAL_FEATURE_CONFIGS)
    for (const { feature, hasAccess } of accessList) {
      response.cookies.set(getCookieKey(feature), hasAccess.toString())
    }
    return response
  }
}
