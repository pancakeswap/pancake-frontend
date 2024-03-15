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
  aapfp: new ERC20Token(
    ChainId.ENDURANCE,
    '0x5d2d4BAa31e79777383aC407d45495B44D0140b7',
    18,
    'AAPFP',
    'AceArenaPFP',
    'https://www.fusionist.io',
  ),
}
