import { ChainId, CurrencyAmount, Native } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { Address } from 'viem'

import { CROSS_CHAIN_GAS_MULTIPLIER } from '../constants'
import { OnChainProvider } from '../types'
import { getInfoSenderContract, getLayerZeroChainId } from '../utils'

type Params = {
  account: Address
  srcChainId: ChainId
  dstChainId: ChainId
  provider: OnChainProvider

  gasMultiplierEnabled?: boolean
}

export async function getBridgeICakeGasFee({
  account,
  dstChainId,
  provider,
  srcChainId,
  gasMultiplierEnabled = true,
}: Params) {
  const lzDstChainId = getLayerZeroChainId(dstChainId)
  const contract = getInfoSenderContract({ chainId: srcChainId, provider })

  try {
    const [nativeFee] = await contract.read.getEstimateGasFees([account, lzDstChainId])
    const multipliedFee = new BigNumber((CROSS_CHAIN_GAS_MULTIPLIER as Record<ChainId, number>)[dstChainId] || 1).times(
      new BigNumber(nativeFee.toString()),
    )
    const fee = gasMultiplierEnabled ? multipliedFee.integerValue().toString() : nativeFee.toString()
    return CurrencyAmount.fromRawAmount(Native.onChain(srcChainId), fee)
  } catch (e) {
    console.error(e)
    throw e
  }
}
