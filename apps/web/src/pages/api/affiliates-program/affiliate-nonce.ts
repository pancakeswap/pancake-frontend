import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'
import { AFFILIATE_NONCE_SID } from 'pages/api/affiliates-program/affiliate-login'
import { MAX_AGE } from 'config/constants/affiliatesProgram'

const affiliateNonce = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL || !req.query) {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const response = await fetch(`${process.env.AFFILIATE_PROGRAM_API_URL}/affiliate/nonce`)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const { nonce } = await response.json()
  setCookie(AFFILIATE_NONCE_SID, response.headers.get('set-cookie'), {
    req,
    res,
    maxAge: MAX_AGE,
    sameSite: true,
  })

  return res.status(200).json({ nonce })
}

export default affiliateNonce
