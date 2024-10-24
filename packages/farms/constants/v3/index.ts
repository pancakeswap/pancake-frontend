import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const bCakeFarmBoosterV3Address: Addresses = {
  [ChainId.BSC]: '0x695170faE243147b3bEB4C43AA8DE5DcD9202752',
  [ChainId.BSC_TESTNET]: '0x56666300A1E25624489b661f3C6c456c159a109a',
}
export const bCakeFarmBoosterV3VeCakeAddress: Addresses = {
  [ChainId.BSC]: '0x625F45234D6335859a8b940960067E89476300c6',
  [ChainId.BSC_TESTNET]: '0x1F32591CC45f00BaE3A742Bf2bCAdAe59DbAd228',
  [ChainId.ARBITRUM_ONE]: '0xc4EfD50205Ccd15c192F342B3837d644c8fff99a',
  [ChainId.ETHEREUM]: '0xE604940C06DF1B6A9851f8E8D8d22468CB932E38',
  [ChainId.ZKSYNC]: '0xBF5412F6217Fd57caf46e51f7929ea6f74739D21',
}

export const bCakeFarmWrapperBoosterVeCakeAddress: Addresses = {
  [ChainId.BSC]: '0x5dbC7e443cCaD0bFB15a081F1A5C6BA0caB5b1E6',
  [ChainId.ARBITRUM_ONE]: '0x21Eb14cf06270Ef944A1480bEf9163fe4Cf7DB14',
  [ChainId.ETHEREUM]: '0xB509DBeE68B273767Cd8D45c1Ce95453391741f6',
  [ChainId.ZKSYNC]: '0x5497577d6d37B825C74B0d41F580a009b79362eB',
}
