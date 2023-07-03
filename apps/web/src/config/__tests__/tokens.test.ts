import { Token } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens } from '@pancakeswap/tokens'
import { erc20ABI } from 'wagmi'
import map from 'lodash/map'
import slice from 'lodash/slice'
import omitBy from 'lodash/omitBy'
import { describe, it } from 'vitest'
import { publicClient } from '../../utils/wagmi'

const whitelist = ['deprecated_tusd']

// remove BNB because it's not a Bep20 token
// remove ONE because there are two tokens with the symbol ONE (Harmony ONE and BigONE)
// remove HERO because there are two tokens with the symbol HERO (StepHero and Hero)
// remove aBNBc because the token has been exploited
const bscTokensToTest = omitBy(
  bscTokens,
  (token) =>
    token.symbol.toLowerCase() === 'bnb' ||
    token.symbol.toLowerCase() === 'one' ||
    token.symbol.toLowerCase() === 'bttold' ||
    token.symbol.toLowerCase() === 'abnbc' ||
    token.symbol.toLowerCase() === 'hero',
)
const tokenListsToTest = [bscTokensToTest, ethereumTokens]

const tokenTables: [string, Token][] = tokenListsToTest.reduce(
  (acc, cur) => [...acc, ...map(cur, (token, key) => [key, token])],
  [],
)

describe.concurrent(
  'Config tokens',
  () => {
    it.each(slice(tokenTables, tokenTables.length - 50))(
      'Token %s has the correct key, symbol, and decimal',
      async (key: string, token: Token) => {
        const client = publicClient({ chainId: token.chainId })
        const [symbol, decimals] = await client.multicall({
          contracts: [
            {
              abi: erc20ABI,
              address: token.address,
              functionName: 'symbol',
            },
            {
              abi: erc20ABI,
              address: token.address,
              functionName: 'decimals',
            },
          ],
          allowFailure: false,
        })
        const isWhitelisted = whitelist.includes(key.toLowerCase())
        if (!isWhitelisted) expect(key.toLowerCase()).toBe(token.symbol.toLowerCase())
        expect(token.symbol.toLocaleLowerCase()).toBe(symbol.toLocaleLowerCase())
        expect(token.decimals).toBe(decimals)
      },
    )
  },
  {
    timeout: 50_000,
  },
)
