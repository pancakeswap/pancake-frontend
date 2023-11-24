// middlewares/withHeaders.ts
import { AB_TESTING_FEATURE_FLAG_MAP } from 'contexts/ABTestingContext/config'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { FeatureFlagInfo, MiddlewareFactory } from './types'

// this function generates a deterministic result for a user for a given feature
// it hashes a concatination of the users ip together with the features identifier and
// probanility value. this allows us to ensure that a users probability result is different
// for each feature gauranteeing a better distribution
export const generateUserDeterministicValue = async (
  userIp: string,
  abTestingfeatureFlagInfo: FeatureFlagInfo[],
): Promise<{ userWhitelistResults: { hasAccess: boolean; scaledResult: number }[] }> => {
  const userWhitelistResults = await Promise.all(
    abTestingfeatureFlagInfo.map(
      async (flag: FeatureFlagInfo): Promise<{ hasAccess: boolean; scaledResult: number }> => {
        if (flag.whitelistedIps.includes(userIp)) return { hasAccess: true, scaledResult: 0 }

        const msgBuffer = new TextEncoder().encode(`${userIp}-${flag.featureFlagKey}-${flag.probabilityThreshold}`)
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

        const scaledResult = parseInt(hashHex.slice(-2), 16) / 255
        return { hasAccess: Boolean(scaledResult < flag.probabilityThreshold), scaledResult }
      },
    ),
  )

  return { userWhitelistResults }
}

const ctxKey = (key) => `ctx-${key.toLowerCase()}`

export const withABHeaders: MiddlewareFactory = () => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    let ip = request.ip ?? request.headers.get('x-real-ip')
    const forwardedFor = request.headers.get('x-forwarded-for')

    if (!ip && forwardedFor) ip = forwardedFor.split(',').at(0) ?? 'Unknown'
    if (!ip) return NextResponse.next()

    const featureFlagInfo = Object.values(AB_TESTING_FEATURE_FLAG_MAP)
    const featureFlagKeys = Object.keys(AB_TESTING_FEATURE_FLAG_MAP)

    const { userWhitelistResults } = await generateUserDeterministicValue(ip, featureFlagInfo)
    const ABUserTestHeaderdata: { [key: string]: string } = {}

    // set the header keys data map
    for (let i = 0; i < featureFlagKeys.length; i++) {
      const normalizedHeaderKey = ctxKey(featureFlagKeys[i])
      ABUserTestHeaderdata[normalizedHeaderKey] = userWhitelistResults[i].scaledResult.toString()
    }
    const responseHeaderKeys = Object.keys(ABUserTestHeaderdata)
    const responseHeaders = new Headers(request.headers)

    for (let i = 0; i < responseHeaderKeys.length; i++) {
      if (request.headers.get(responseHeaderKeys[i])) {
        throw new Error(`Key ${responseHeaderKeys[i].substring(4)} is being spoofed. Blocking this request.`)
      }
      responseHeaders.set(responseHeaderKeys[i], userWhitelistResults[i].scaledResult.toString())
    }

    return NextResponse.next({ request: { headers: responseHeaders } })
  }
}
