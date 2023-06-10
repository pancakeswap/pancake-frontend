import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { string as zString, object as zObject } from 'zod'

const zQuery = zObject({
  address: zString(),
})

const userExist = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL && !req.query) {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const requestUrl = `${process.env.AFFILIATE_PROGRAM_API_URL}/user/exist?${queryString}`
  const response = await fetch(requestUrl)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const result = await response.json()

  res.setHeader('Cache-Control', 's-maxage=60, max-age=30, stale-while-revalidate=300')

  return res.status(200).json(result)
}

export default userExist
