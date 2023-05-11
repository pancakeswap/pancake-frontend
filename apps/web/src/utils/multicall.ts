import { CallOverrides } from 'ethers'
import { createMulticall, Call } from '@pancakeswap/multicall'
import { publicClient } from './wagmi'

export type { Call }

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicall, multicallv2, multicallv3 } = createMulticall(publicClient)

export default multicall

export { multicallv2, multicallv3 }
