import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

export const AFFILIATE_SID = 'AFFILIATE_SID'
export const AFFILIATE_NONCE_SID = 'AFFILIATE_NONCE_SID'

const affiliateLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL && req.method === 'POST') {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const cookie = getCookie(AFFILIATE_NONCE_SID, { req, res })
  const requestUrl = `${process.env.AFFILIATE_PROGRAM_API_URL}/affiliate/login`
  const response = await fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie.toString() ?? '',
    },
    method: 'POST',
    body: req.body,
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const { status } = await response.json()

  return res.status(200).json({
    status,
    [AFFILIATE_SID]: response.headers.get('set-cookie') ?? '',
  })
}

export default affiliateLogin
