import { Currency } from '@pancakeswap/swap-sdk-core'

import { logger } from './datadog'

export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}

export const logSwap = ({
  input,
  output,
  inputAmount,
  outputAmount,
  chainId,
  account,
  hash,
  type,
}: {
  input: Currency
  output: Currency
  inputAmount?: string
  outputAmount?: string
  chainId: number
  account: `0x${string}`
  hash: `0x${string}`
  type: 'V2Swap' | 'SmartSwap' | 'StableSwap' | 'MarketMakerSwap' | 'V3SmartSwap' | 'UniversalRouter'
}) => {
  try {
    logger.info(type, {
      inputAddress: input.isToken ? input.address.toLowerCase() : input.symbol,
      outputAddress: output.isToken ? output.address.toLowerCase() : output.symbol,
      inputAmount,
      outputAmount,
      account,
      hash,
      chainId,
    })
  } catch (error) {
    //
  }
}
