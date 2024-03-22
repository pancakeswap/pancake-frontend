import { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'

import { z } from 'zod'

const zQuery = z.object({
  pagination: z.object({
    pageSize: z.coerce.number().max(10).nullable(),
    page: z.coerce.number().nullable(),
  }),
})

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

  const queryParsed = qs.parse(queryString)

  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const requestUrl = `${process.env.STRAPI_API_URL}/api/articles?${queryString}`
  const response = await fetch(requestUrl, mergedOptions)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const data = await response.json()

  res.setHeader('Cache-Control', 'max-age=30, s-maxage=60, stale-while-revalidate=300')

  return res.status(200).json(data)
}

export default articles
