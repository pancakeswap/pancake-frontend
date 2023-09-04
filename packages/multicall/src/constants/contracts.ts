import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.ZKSYNC]: '0xbB7f63b41Fcc4F5f376AD360b14B3184fb8607e5',
  [ChainId.BSC]: '0x26896202296fF7Fc3ea76290b98ef00c5C8FB80e',
}
