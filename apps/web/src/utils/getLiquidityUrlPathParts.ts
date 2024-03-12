// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { NATIVE, WNATIVE } from '@pancakeswap/sdk'
import type { FeeAmount } from '@pancakeswap/v3-sdk'
import { CHAIN_QUERY_NAME } from 'config/chains'

const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
  feeAmount,
  chainId,
}: {
  quoteTokenAddress?: string
  tokenAddress?: string
  feeAmount?: FeeAmount
  chainId?: number
}): string => {
  if (!chainId || !tokenAddress) return ''

  const wNativeAddress = WNATIVE[chainId]
  const firstPart =
    !quoteTokenAddress || quoteTokenAddress === wNativeAddress?.address ? NATIVE[chainId].symbol : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wNativeAddress?.address ? NATIVE[chainId].symbol : tokenAddress
  return `${firstPart}/${secondPart}${feeAmount ? `/${feeAmount}` : ''}?chain=${CHAIN_QUERY_NAME[chainId]}`
}

export default getLiquidityUrlPathParts
