import map from 'lodash/map'
import omitBy from 'lodash/omitBy'
import erc20ABI from 'config/abi/erc20.json'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import multicall from 'utils/multicall'

// remove BNB because it's not a Bep20 token
const tokensToTest = omitBy(tokens, (token) => token.symbol.toLowerCase() === 'bnb')

describe('Config tokens', () => {
  it.each(map(tokensToTest, (token, key) => [key, token]))('Token %s', async (key, token: Token) => {
    const [[symbol], [decimals]] = await multicall(erc20ABI, [
      {
        address: token.address[56],
        name: 'symbol',
      },
      {
        address: token.address[56],
        name: 'decimals',
      },
    ])

    expect(key).toBe(token.symbol.toLowerCase())
    expect(token.symbol.toLowerCase()).toBe(symbol.toLowerCase())
    expect(token.decimals).toBe(parseInt(decimals, 10))
  })
})
