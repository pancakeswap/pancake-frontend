import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAINS = [ChainId.ENDURANCE] as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]
