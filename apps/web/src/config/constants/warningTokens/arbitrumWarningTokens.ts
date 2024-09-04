import { ChainId } from '@pancakeswap/chains'
import { ERC20Token } from '@pancakeswap/sdk'

export const arbitrumWarningTokens = {
  mPendle: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xB688BA096b7Bb75d7841e47163Cd12D18B36A5bF',
    18,
    'mPendle',
    'mPendle',
    '',
  ),
}
