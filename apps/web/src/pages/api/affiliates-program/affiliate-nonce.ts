import type { NextApiRequest, NextApiResponse } from 'next'
import { AFFILIATE_NONCE_SID } from 'pages/api/affiliates-program/affiliate-login'

const affiliateNonce = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL || !req.query) {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const response = await fetch(`${process.env.AFFILIATE_PROGRAM_API_URL}/affiliate/nonce`)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const result = await response.json()

  return res.status(200).json({
    nonce: result.nonce,
    [AFFILIATE_NONCE_SID]: response.headers.get('set-cookie') ?? '',
  })
}

export default affiliateNonce
