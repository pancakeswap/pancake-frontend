import { CallOverrides } from '@ethersproject/contracts'
import { createMulticall, Call } from '@pancakeswap/multicall'
import { provider } from './wagmi'

export type { Call }

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicall, multicallv2 } = createMulticall(provider)

export default multicall

export { multicallv2 }
