import { ChainId } from '@pancakeswap/chains'
import { arbitrum, base, bsc, zkSync } from 'wagmi/chains'

export const targetChains = [bsc, zkSync, arbitrum, base]

export const SUPPORTED_CHAIN = [ChainId.BSC, ChainId.ZKSYNC, ChainId.ARBITRUM_ONE, ChainId.BASE]
