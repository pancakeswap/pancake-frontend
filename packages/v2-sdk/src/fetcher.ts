import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { erc20Abi } from '@pancakeswap/swap-sdk-evm'
import invariant from 'tiny-invariant'
import { Address, PublicClient, createPublicClient, getContract, http } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains'

import { pancakePairV2ABI } from './abis/IPancakePair'
import { Pair } from './entities/pair'

let TOKEN_DECIMALS_CACHE: { [chainId: number]: { [address: string]: number } } = {
  [ChainId.BSC]: {},
}

const ethClient = createPublicClient({ chain: mainnet, transport: http() })
const bscClient = createPublicClient({ chain: bsc, transport: http() })
const bscTestnetClient = createPublicClient({ chain: bscTestnet, transport: http() })
const goerliClient = createPublicClient({ chain: goerli, transport: http() })

const getDefaultClient = (chainId: ChainId): PublicClient => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return ethClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return bscClient
  }
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
   * Fetch information for a given token on the given chain, using the given viem provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol symbol of the token
   * @param name optional name of the token
   */
  public static async fetchTokenData(
    chainId: ChainId,
    address: Address,
    publicClient: any = getDefaultClient(chainId),
    symbol: string,
    name?: string,
  ): Promise<Token> {
    const erc20 = getContract({
      abi: erc20Abi,
      address,
      client: publicClient as PublicClient,
    })
    const parsedDecimals =
      typeof TOKEN_DECIMALS_CACHE?.[chainId]?.[address] === 'number'
        ? TOKEN_DECIMALS_CACHE[chainId][address]
        : await erc20.read.decimals().then((decimals): number => {
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
    publicClient: any = getDefaultClient(tokenA.chainId),
  ): Promise<Pair> {
    invariant(tokenA.chainId === tokenB.chainId, 'CHAIN_ID')
    const address = Pair.getAddress(tokenA, tokenB)
    const pairContract: any = getContract({
      abi: pancakePairV2ABI,
      address,
      client: publicClient,
    })
    const [reserves0, reserves1] = await pairContract.read.getReserves()
    const balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0]
    return new Pair(
      CurrencyAmount.fromRawAmount(tokenA, balances[0]),
      CurrencyAmount.fromRawAmount(tokenB, balances[1]),
    )
  }
}
