import qs from 'qs'

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${process.env.STRAPI_API_URL || 'http://localhost:1337'}${path}`
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
      Authorization: `Bearer ${process.env.STRAPI_PREVIEW_SECRET}`,
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
    throw new Error(`An error occurred please try again`)
  }
  const data = await response.json()
  return data
}
