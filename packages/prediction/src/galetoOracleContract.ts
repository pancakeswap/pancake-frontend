import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

// Get the address from galeto task address, can find it at Typescript Function, Arguments -> pythNetworkAggregatorV3

export const galetoOracleETH: Record<string, Address> = {
  [ChainId.ZKSYNC]: '0xD4A954E8EFbfC1dd650b10cA314922900bd65Dba',
}
