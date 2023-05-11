import { createMulticall, Call } from '@pancakeswap/multicall'
import { publicClient } from './wagmi'

export type { Call }

const { multicallv2 } = createMulticall(publicClient)

export { multicallv2 }
