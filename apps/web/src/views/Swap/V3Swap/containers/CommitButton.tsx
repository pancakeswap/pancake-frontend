import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { TradeType } from '@pancakeswap/swap-sdk-core'
import { MMCommitTrade } from '../types'
import { MMCommitButton } from './MMCommitButton'
import { MMCommitButtonV2 } from './MMCommitButtonV2'
import { SwapCommitButton } from './SwapCommitButton'
import { SwapCommitButtonV2 } from './SwapCommitButtonV2'

export type CommitButtonProps = {
  trade: SmartRouterTrade<TradeType> | MMCommitTrade | undefined
  tradeError?: Error
  tradeLoaded: boolean
  beforeCommit?: () => void
  afterCommit?: () => void
  useUniversalRouter?: boolean
}

export const CommitButton: React.FC<CommitButtonProps> = ({
  useUniversalRouter,
  trade,
  tradeError,
  tradeLoaded,
  beforeCommit,
  afterCommit,
}) => {
  if (trade && 'isMMBetter' in trade && trade?.isMMBetter) {
    const currentTrade = trade as MMCommitTrade
    return useUniversalRouter ? (
      <MMCommitButtonV2 {...currentTrade} beforeCommit={beforeCommit} afterCommit={afterCommit} />
    ) : (
      <MMCommitButton {...currentTrade} />
    )
  }

  const currentTrade = trade as SmartRouterTrade<TradeType>
  return useUniversalRouter ? (
    <SwapCommitButtonV2
      trade={currentTrade}
      tradeError={tradeError}
      tradeLoading={!tradeLoaded}
      beforeCommit={beforeCommit}
      afterCommit={afterCommit}
    />
  ) : (
    <SwapCommitButton trade={currentTrade} tradeError={tradeError} tradeLoading={!tradeLoaded} />
  )
}
