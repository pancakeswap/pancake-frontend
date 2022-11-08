import { BestTradeOptions as BaseBestTradeOptions, ChainId } from '@pancakeswap/sdk'
import { Provider as IProvider } from '@ethersproject/providers'

export type Provider = ({ chainId }: { chainId?: ChainId }) => IProvider

export interface BestTradeOptions extends BaseBestTradeOptions {
  provider: Provider
}
