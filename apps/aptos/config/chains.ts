import { defaultChain } from '@pancakeswap/awgmi'
import { mainnet, testnet, Chain } from '@pancakeswap/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
