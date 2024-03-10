import { ChainId, ERC20Token, WACE } from '@pancakeswap/sdk'

export const enduranceTokens = {
  wace: WACE[ChainId.ENDURANCE],
  aceUSD: new ERC20Token(
    ChainId.ENDURANCE,
    '0x853e38D0B35D2df54d3d91c210b7BD7749d614E8',
    18,
    'AceUSD',
    'AceUSD',
    'https://www.fusionist.io',
  ),
}
