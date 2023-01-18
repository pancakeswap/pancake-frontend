import qs from 'qs'

const STRAPI_PUBLIC_API_TOKEN =
  'fdc489952ca99b260feaa8f64248e21e970c803c9eea8b25571df2663ebe0b958ffb178fba0ef0ad07cbf57cbaa59a759f599ab74cf59df34e1482f730fa8449cae4031c9c1430e36f1aba72640b2731b713597b98f2da2bdb9456e93937f2a1bd6916d7eaa6f40bdf7b40a48edbfc6fadd3ee8c9491bdeb3501d1a9c72406fb'

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_PUBLIC_API_TOKEN}`,
    },
    ...options,
  }

  // Build request URL
  const queryString = qs.stringify(urlParamsObject)
  const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`)}`

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions)

  // Handle response
  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`An error occured please try again`)
  }
  const data = await response.json()
  return data
}
