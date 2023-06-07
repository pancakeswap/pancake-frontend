import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { string as zString, object as zObject } from 'zod'
import crypto from 'crypto'

const zQuery = zObject({
  walletAddress: zString(),
})

const signMercuryoUrl = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const queryString = qs.stringify(req.body)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }
  const { walletAddress } = parsed.data
  const signature = crypto.createHmac('sha512', `${walletAddress}${'9r8egtsb27bzr101em7uw7zhcrlwdbp'}`)

  return res.json({ signature })
}

export default signMercuryoUrl
