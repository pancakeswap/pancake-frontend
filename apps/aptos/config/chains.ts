import { defaultChain } from '@pancakeswap/awgmi'
import { mainnet, testnet, devnet, Chain } from '@pancakeswap/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet, process.env.NODE_ENV === 'development' ? devnet : undefined].filter(
  Boolean,
) as Chain[]
