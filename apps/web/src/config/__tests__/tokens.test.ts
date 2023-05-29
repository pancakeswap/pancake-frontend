import { ChainId, Token } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { erc20ABI } from 'wagmi'
import map from 'lodash/map'
import slice from 'lodash/slice'
import omitBy from 'lodash/omitBy'
import { describe, it } from 'vitest'
import { publicClient } from '../../utils/wagmi'

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

describe.concurrent(
  'Config tokens',
  () => {
    it.each(slice(tokenTables, tokenTables.length - 50))(
      'Token %s has the correct key, symbol, and decimal',
      async (key: string, token: Token) => {
        const bscClient = publicClient({ chainId: ChainId.BSC })
        const [symbol, decimals] = await bscClient.multicall({
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

        expect(key.toLowerCase()).toBe(token.symbol.toLowerCase())
        expect(token.symbol.toLowerCase()).toBe(symbol.toLowerCase())
        expect(token.decimals).toBe(decimals)
      },
    )
  },
  {
    timeout: 50_000,
  },
)
