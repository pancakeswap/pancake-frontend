import { ChainId, CurrencyAmount, Native } from '@pancakeswap/sdk'
import { Address, getContract } from 'viem'
import BigNumber from 'bignumber.js'

import { OnChainProvider } from '../types'
import { getLayerZeroChainId, isNativeIfoSupported } from '../utils'
import { INFO_SENDER } from '../constants/contracts'
import { pancakeInfoSenderABI } from '../abis/PancakeInfoSender'
import { CROSS_CHAIN_GAS_MULTIPLIER } from '../constants'

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
  if (!isNativeIfoSupported(srcChainId)) {
    throw new Error(`Native ifo not supported on ${srcChainId}`)
  }
  const senderContractAddress = INFO_SENDER[srcChainId]
  const contract = getContract({
    abi: pancakeInfoSenderABI,
    address: senderContractAddress,
    publicClient: provider({ chainId: srcChainId }),
  })

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
