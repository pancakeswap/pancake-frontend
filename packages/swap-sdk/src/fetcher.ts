import { Contract } from '@ethersproject/contracts'
import { getNetwork } from '@ethersproject/networks'
import { getDefaultProvider } from '@ethersproject/providers'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { Pair } from './entities/pair'
import { ChainId } from './constants'
import ERC20 from './abis/ERC20.json'
import IPancakePair from './abis/IPancakePair.json'

let TOKEN_DECIMALS_CACHE: { [chainId: number]: { [address: string]: number } } = {
  [ChainId.BSC]: {},
}

/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
export abstract class Fetcher {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol symbol of the token
   * @param name optional name of the token
   */
  public static async fetchTokenData(
    chainId: ChainId,
    address: string,
    provider = getDefaultProvider(getNetwork(chainId)),
    symbol: string,
    name?: string
  ): Promise<Token> {
    const parsedDecimals =
      typeof TOKEN_DECIMALS_CACHE?.[chainId]?.[address] === 'number'
        ? TOKEN_DECIMALS_CACHE[chainId][address]
        : await new Contract(address, ERC20, provider).decimals().then((decimals: number): number => {
            TOKEN_DECIMALS_CACHE = {
              ...TOKEN_DECIMALS_CACHE,
              [chainId]: {
                ...TOKEN_DECIMALS_CACHE?.[chainId],
                [address]: decimals,
              },
            }
            return decimals
          })
    return new Token(chainId, address, parsedDecimals, symbol, name)
  }

  /**
   * Fetches information about a pair and constructs a pair from the given two tokens.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */
  public static async fetchPairData(
    tokenA: Token,
    tokenB: Token,
    provider = getDefaultProvider(getNetwork(tokenA.chainId))
  ): Promise<Pair> {
    invariant(tokenA.chainId === tokenB.chainId, 'CHAIN_ID')
    const address = Pair.getAddress(tokenA, tokenB)
    const [reserves0, reserves1] = await new Contract(address, IPancakePair, provider).getReserves()
    const balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0]
    return new Pair(
      CurrencyAmount.fromRawAmount(tokenA, balances[0]),
      CurrencyAmount.fromRawAmount(tokenB, balances[1])
    )
  }
}
