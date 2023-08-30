import { ChainId } from '@pancakeswap/sdk'

import {
  DEFAULT_GAS_BUFFER,
  DEFAULT_GAS_BUFFER_BY_CHAIN,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_LIMIT_BY_CHAIN,
} from './constants'
import { OnChainProvider } from './types'
import { getMulticallContract } from './getMulticallContract'

export type GetGasLimitParams = {
  chainId: ChainId
  provider?: OnChainProvider

  // If provided then would override the gas limit got from on chain
  gasLimit?: bigint

  // The gas limit should be whichever is smaller between gasLimit and maxGasLimit
  maxGasLimit?: bigint

  gasBuffer?: bigint
}

export function getDefaultGasLimit(chainId: ChainId) {
  return DEFAULT_GAS_LIMIT_BY_CHAIN[chainId] || DEFAULT_GAS_LIMIT
}

export function getDefaultGasBuffer(chainId: ChainId) {
  return DEFAULT_GAS_BUFFER_BY_CHAIN[chainId] || DEFAULT_GAS_BUFFER
}

export type GetGasLimitOnChainParams = Pick<GetGasLimitParams, 'chainId' | 'provider'>

export async function getGasLimitOnChain({ chainId, provider }: GetGasLimitOnChainParams) {
  const multicall = getMulticallContract({ chainId, provider })
  const gasLeft = (await multicall.read.gasLeft()) as bigint
  return gasLeft
}

export async function getGasLimit({
  chainId,
  gasLimit: gasLimitOverride,
  maxGasLimit = getDefaultGasLimit(chainId),
  gasBuffer = getDefaultGasBuffer(chainId),
  provider,
}: GetGasLimitParams) {
  const gasLimit =
    (gasLimitOverride && BigInt(gasLimitOverride)) || (await getGasLimitOnChain({ chainId, provider })) || maxGasLimit
  const minGasLimit = gasLimit < maxGasLimit ? gasLimit : maxGasLimit
  return minGasLimit - gasBuffer
}
