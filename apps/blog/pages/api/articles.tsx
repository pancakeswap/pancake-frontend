import qs from 'qs'
import { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line consistent-return
export const articles = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.STRAPI_PREVIEW_SECRET || !req.query) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_PREVIEW_SECRET}`,
    },
  }
  const queryString = qs.stringify(req.query)
  const requestUrl = `${process.env.STRAPI_API_URL}/api/articles?${queryString}`
  const response = await fetch(requestUrl, mergedOptions)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occured please try again' })
  }

  let data = await response.json()
  if (typeof process.env.STRAPI_OLD_IMAGE_HOST === 'string') {
    data = JSON.parse(JSON.stringify(data), (key, value) => {
      if (
        key === 'url' &&
        typeof value === 'string' &&
        process.env.STRAPI_OLD_IMAGE_HOST &&
        value.startsWith(process.env.STRAPI_OLD_IMAGE_HOST)
      ) {
        return value.replace(process.env.STRAPI_OLD_IMAGE_HOST, 'https://blog-cdn.pancakeswap.finance')
      }
      return value
    })
  }
  return res.status(200).json(data)
}

export default articles
