import {
  EXPERIMENTAL_FEATURES,
  EXPERIMENTAL_FEATURE_CONFIGS,
  ExperimentalFeatureConfigs,
  FeatureRollOutConfig,
  getCookieKey,
} from 'config/experminetalFeatures'
import { NextFetchEvent, NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'
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
    const randomId = v4()
    const response = (await next(request, _next)) || NextResponse.next()

    const accessList = await getExperimentalFeatureAccessList(randomId, EXPERIMENTAL_FEATURE_CONFIGS)
    for (const { feature, hasAccess } of accessList) {
      const cookieExists = request.cookies.get(getCookieKey(feature))
      if (cookieExists) continue
      response.cookies.set(getCookieKey(feature), hasAccess.toString())
    }
    return response
  }
}
