import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { string as zString, object as zObject } from 'zod'
import crypto from 'crypto'

const zQuery = zObject({
  type: zString(),
  defaultCurrencyCode: zString(),
  redirectUrl: zString(),
  theme: zString(),
  walletAddresses: zString(),
})

const signMercuryoUrl = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const queryString = qs.stringify(req.body)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }
  const { walletAddresses } = parsed.data

  // to do
  const returnData = crypto.createHmac('sha512', `${walletAddresses}${'9r8egtsb27bzr101em7uw7zhcrlwdbp'}`)

  return res.json({ urlWithSignature: returnData })
}

export default signMercuryoUrl
