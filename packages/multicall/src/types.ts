import type { Address } from 'viem'
import { BigintIsh } from '@pancakeswap/sdk'

export type MulticallRequest = {
  target: Address
  callData: string
}

export type MulticallRequestWithGas = MulticallRequest & {
  gasLimit: BigintIsh
}
