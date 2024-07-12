import { ChainId } from '@pancakeswap/chains'
import { arbitrum, base, bsc, mainnet as ethereum, zkSync } from 'wagmi/chains'

export const targetChains = [ethereum, bsc, zkSync, arbitrum, base]

export const SUPPORTED_CHAIN = [ChainId.ETHEREUM, ChainId.BSC, ChainId.ZKSYNC, ChainId.ARBITRUM_ONE, ChainId.BASE]
