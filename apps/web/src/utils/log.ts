import { Currency } from '@pancakeswap/swap-sdk-core'
import { log } from 'next-axiom'

export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}

export const logSwap = ({
  input,
  output,
  inputAmount,
  outputAmount,
  chainId,
  type,
}: {
  input: Currency
  output: Currency
  inputAmount: string
  outputAmount: string
  chainId: number
  type: 'V2Swap' | 'SmartSwap' | 'StableSwap'
}) => {
  try {
    log.info(type, {
      inputAddress: input.isToken ? input.address.toLowerCase() : input.symbol,
      outputAddress: output.isToken ? output.address.toLowerCase() : output.symbol,
      inputAmount,
      outputAmount,
      chainId,
    })
  } catch (error) {
    //
  }
}
