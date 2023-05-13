import { BestTradeOptions as BaseBestTradeOptions, ChainId, Currency, Pair } from '@pancakeswap/sdk'
import { providers } from 'ethers'

export type Provider = ({ chainId }: { chainId?: ChainId }) => providers.Provider

export interface BestTradeOptions extends BaseBestTradeOptions {
  provider: Provider

  // If not provided, will use the given provider to fetch pairs on chain
  allCommonPairs?: Pair[] | ((one: Currency, another: Currency) => Promise<Pair[]> | Pair[])
}

export enum RouteType {
  V2,
  STABLE_SWAP,
  MIXED,
}
