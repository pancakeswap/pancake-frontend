import { ZYFI_SPONSORED_PAYMASTER_URL, ZYFI_PAYMASTER_URL, paymasterInfo } from 'config/paymaster'
import stringify from 'fast-json-stable-stringify'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { call, account, gasTokenAddress } = req.body

  try {
    const gasTokenInfo = paymasterInfo[gasTokenAddress]
    const isSponsored = gasTokenInfo?.discount === 'FREE'

    const PAYMASTER_URL = isSponsored ? ZYFI_SPONSORED_PAYMASTER_URL : ZYFI_PAYMASTER_URL

    const response = await fetch(PAYMASTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': isSponsored ? process.env.ZYFI_API_KEY || '' : '',
      },
      body: stringify({
        feeTokenAddress: gasTokenAddress,
        gasLimit: call.gas,
        txData: {
          from: account,
          to: call.address,
          value: call.value,
          data: call.calldata,
        },

        ...(isSponsored && {
          sponsorshipRatio: 100,
        }),
      }),
    })

    return res.status(response.status).json(await response.json())
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export default handler
