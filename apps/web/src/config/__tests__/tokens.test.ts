import { Token } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import erc20ABI from 'config/abi/erc20.json'
import map from 'lodash/map'
import slice from 'lodash/slice'
import omitBy from 'lodash/omitBy'
import multicall from 'utils/multicall'
import { describe, it } from 'vitest'

// remove BNB because it's not a Bep20 token
// remove ONE because there are two tokens with the symbol ONE (Harmony ONE and BigONE)
// remove HERO because there are two tokens with the symbol HERO (StepHero and Hero)
// remove aBNBc because the token has been exploited
const tokensToTest = omitBy(
  bscTokens,
  (token) =>
    token.symbol.toLowerCase() === 'bnb' ||
    token.symbol.toLowerCase() === 'one' ||
    token.symbol.toLowerCase() === 'bttold' ||
    token.symbol.toLowerCase() === 'abnbc' ||
    token.symbol.toLowerCase() === 'hero',
)

const tokenTables: [string, Token][] = map(tokensToTest, (token, key) => [key, token])

describe.concurrent('Config tokens', () => {
  it.each(slice(tokenTables, tokenTables.length - 50))(
    'Token %s has the correct key, symbol, and decimal',
    async (key: string, token: Token) => {
      const [[symbol], [decimals]] = await multicall(erc20ABI, [
        {
          address: token.address,
          name: 'symbol',
        },
        {
          address: token.address,
          name: 'decimals',
        },
      ])

      expect(key.toLowerCase()).toBe(token.symbol.toLowerCase())
      expect(token.symbol.toLowerCase()).toBe(symbol.toLowerCase())
      expect(token.decimals).toBe(parseInt(decimals, 10))
    },
  )
})
