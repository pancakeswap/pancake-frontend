import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.ZKSYNC]: '0x5166acEd8Cdc2372A8D36DcF917d0a98cB85933f',
  [ChainId.BSC]: '0x804708De7AF615085203FA2B18Eae59C5738e2a9',
}
