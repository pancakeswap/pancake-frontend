import qs from 'qs'
import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { string as zString, object as zObject } from 'zod'
import { AFFILIATE_SID } from 'pages/api/affiliates-program/affiliate-login'

const zQuery = zObject({
  skip: zString(),
  take: zString(),
})

const affiliateClaimList = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = getCookie(AFFILIATE_SID, { req, res, sameSite: true })

  if (!process.env.AFFILIATE_PROGRAM_API_URL && !req.query && !cookie) {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const requestUrl = `${process.env.AFFILIATE_PROGRAM_API_URL}/affiliate/fee/claim/list?${queryString}`
  const response = await fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie?.toString() ?? '',
    },
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const result = await response.json()
  return res.status(200).json(result)
}

export default affiliateClaimList
