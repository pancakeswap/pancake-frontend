import { ChainId, Token } from '@pancakeswap/sdk'

export const bscWarningTokens = {
  pokemoney: new Token(ChainId.BSC, '0x32ff5b4C3B1744F0344D96fA2f87799Ed2805749', 18, 'PMY', 'Pokemoney Coin', ''),
  free: new Token(ChainId.BSC, '0x880BCe9321c79cAc1D290De6d31DDE722C606165', 8, 'FREE', 'Freedom Protocol Token', ''),
  safemoon: new Token(
    ChainId.BSC,
    '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
    9,
    'SAFEMOON',
    'Safemoon Token',
    'https://safemoon.net/',
  ),
}

export const bscTestnetWarningTokens = {}
