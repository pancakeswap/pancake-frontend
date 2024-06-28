import crypto from 'crypto'
import qs from 'qs'

export function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!*()']/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

export function generateSignatureBaseString(method: string, url: string, params: Record<string, string>): string {
  const parameterString = qs.stringify(params, { encode: false, sort: (a, b) => a.localeCompare(b) })
  const encodedUrl = percentEncode(url)
  const encodedParameterString = percentEncode(parameterString)

  return `${method.toUpperCase()}&${encodedUrl}&${encodedParameterString}`
}

export function generateSigningKey(consumerSecret: string, tokenSecret: string): string {
  return `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`
}

export function generateSignature(baseString: string, signingKey: string): string {
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64')
}
