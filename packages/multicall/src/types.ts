import type { Address } from 'viem'
import { BigintIsh } from '@pancakeswap/sdk'

export type MulticallRequest = {
  to: Address
  data: string
}

export type MulticallRequestWithGas = MulticallRequest & {
  gas: BigintIsh
}
