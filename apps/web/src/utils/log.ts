import { Currency } from '@pancakeswap/swap-sdk-core'
import { log } from 'next-axiom'

export const logTx = ({ account, hash, chainId }: LogTx) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}

type LogTx = { account: string; hash: string; chainId: number }

export const logSwapTx = ({
  input,
  output,
  inputAmount,
  outputAmount,
  chainId,
  type,
  account,
  hash,
  connectorId,
}: {
  input: Currency
  output: Currency
  inputAmount: string
  outputAmount: string
  type: 'V2Swap' | 'SmartSwap' | 'StableSwap'
  connectorId?: string
} & LogTx) => {
  try {
    log.info(type, {
      inputAddress: input.isToken ? input.address.toLowerCase() : input.symbol,
      outputAddress: output.isToken ? output.address.toLowerCase() : output.symbol,
      inputAmount,
      outputAmount,
      chainId,
      connectorId,
      account,
      hash,
    })
    logTx({ account, hash, chainId })
  } catch (error) {
    //
  }
}
