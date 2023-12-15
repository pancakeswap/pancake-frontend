import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

// Get the address from galeto task address, can find it at Typescript Function, Arguments -> pythNetworkAggregatorV3

export const galetoOracleETH: Record<string, Address> = {
  [ChainId.ZKSYNC]: '0x48F3aAeBea55c80aB7815D829C9B48D57c1b3bab',
}
