import { CallOverrides } from '@ethersproject/contracts'
import { createMulticall, Call } from '@pancakeswap/multicall'
import { provider } from './wagmi'

export type { Call }

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicallv2 } = createMulticall(provider)

export default multicallv2
