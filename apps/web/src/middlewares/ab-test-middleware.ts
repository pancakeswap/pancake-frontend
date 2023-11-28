import { EXPERIMENTAL_FEATURES, EXPERIMENTAL_FEATURE_FLAG_MAP, FeatureRollOutConfig } from 'config/experminetalFeatures'
import { NextFetchEvent, NextResponse } from 'next/server'
import { generateEncodedQueryParams } from 'utils/datadog'
import { EnumValues, MiddlewareFactory, ModifiedNextReq } from './types'

type FeatureKeys = EnumValues<typeof EXPERIMENTAL_FEATURES>[]

const ctxKey = (key: EXPERIMENTAL_FEATURES) => `ctx-${key.toLowerCase()}`

// this function generates a deterministic result for a user for a given feature
// it hashes a concatination of the users ip together with the features identifier and
// probanility value. this allows us to ensure that a users probability result is different
// for each feature gauranteeing a better distribution
export const getExperimentalFeatureAccessList = async (
  userIdentifier: string,
  abTestingfeatureFlagInfo: FeatureRollOutConfig[],
  response: NextResponse,
): Promise<Array<'true' | 'false'>> => {
  const userWhitelistResults = await Promise.all(
    abTestingfeatureFlagInfo.map(async (flag: FeatureRollOutConfig): Promise<'true' | 'false'> => {
      if (flag.whitelist.includes(userIdentifier)) return 'true'

      const msgBuffer = new TextEncoder().encode(`${userIdentifier}-${flag.feature}-${flag.percentage}`)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      const scaledValue = parseInt(hashHex.slice(-2), 16) / 255
      response.cookies.set(`${ctxKey(flag.feature)}-user-percent`, scaledValue.toString())

      return scaledValue < flag.percentage ? 'true' : 'false'
    }),
  )
  return userWhitelistResults
}

export const withABHeaders: MiddlewareFactory = () => {
  return async (request: ModifiedNextReq, _next: NextFetchEvent) => {
    const response = NextResponse.next()
    try {
      const ip = request.userIp
      if (!ip) return response

      const featureFlagInfo = Object.values(EXPERIMENTAL_FEATURE_FLAG_MAP)
      const featureFlagKeys = Object.keys(EXPERIMENTAL_FEATURE_FLAG_MAP) as FeatureKeys
      const userWhitelistResults = await getExperimentalFeatureAccessList(ip, featureFlagInfo, response)

      for (let i = 0; i < featureFlagKeys.length; i++) {
        response.cookies.set(ctxKey(featureFlagKeys[i]), userWhitelistResults[i])
        response.cookies.set(`${ctxKey(featureFlagKeys[i])}-user-ip`, ip)
      }
      await fetch(
        `http://localhost:3000/api/log?${generateEncodedQueryParams['web-notifications']({
          ip,
          userWhitelistResults,
        })}`,
      )
      return response
    } catch (error) {
      await fetch(
        `http://localhost:3000/api/log?datadogData=${generateEncodedQueryParams['web-notifications']({ error })}`,
      )
      return response
    }
  }
}
