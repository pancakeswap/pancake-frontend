import {
  PAYMASTER_CONTRACT_WHITELIST,
  ZYFI_PAYMASTER_URL,
  ZYFI_SPONSORED_PAYMASTER_URL,
  paymasterInfo,
} from 'config/paymaster'
import stringify from 'fast-json-stable-stringify'
import { NextApiHandler } from 'next'
import { calculateGasMargin } from 'utils'
import { decodeFunctionData, erc20Abi } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { call, account, gasTokenAddress } = req.body

  if (!call || !account || !gasTokenAddress) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    let isTransactionWhitelisted = PAYMASTER_CONTRACT_WHITELIST.includes(call.address.toLowerCase())

    try {
      // Check calldata for ERC20 approve
      const decodedCalldata = decodeFunctionData({ data: call.calldata, abi: erc20Abi })
      if (decodedCalldata.functionName === 'approve') isTransactionWhitelisted = true
    } catch (e) {
      // do nothing. must be another type of transaction if decoding failed
    }

    if (!isTransactionWhitelisted) {
      return res.status(400).json({ error: 'Transaction type not whitelisted for Paymaster' })
    }

    const gasTokenInfo = paymasterInfo[gasTokenAddress]
    const isSponsored = gasTokenInfo?.discount === 'FREE'

    const PAYMASTER_URL = isSponsored ? ZYFI_SPONSORED_PAYMASTER_URL : ZYFI_PAYMASTER_URL
    const gas = calculateGasMargin(BigInt(call.gas), 2000n)

    const response = await fetch(PAYMASTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': isSponsored ? process.env.ZYFI_API_KEY || '' : '',
      },
      body: stringify({
        feeTokenAddress: gasTokenAddress,
        gasLimit: Number(gas),
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
