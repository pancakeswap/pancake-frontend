import { InterfaceOrder, isMMOrder } from 'views/Swap/utils'
import { MMCommitButton } from './MMCommitButton'
import { SwapCommitButton } from './SwapCommitButton'

export type CommitButtonProps = {
  order: InterfaceOrder | undefined
  // trade: Trade | MMCommitTrade<SmartRouterTrade<TradeType>> | undefined
  tradeError?: Error | null
  tradeLoaded: boolean
  beforeCommit?: () => void
  afterCommit?: () => void
}

export const CommitButton: React.FC<CommitButtonProps> = ({
  order,
  tradeError,
  tradeLoaded,
  beforeCommit,
  afterCommit,
}) => {
  if (isMMOrder(order)) {
    return <MMCommitButton {...order} beforeCommit={beforeCommit} afterCommit={afterCommit} />
  }

  return (
    <SwapCommitButton
      order={order}
      tradeError={tradeError}
      tradeLoading={!tradeLoaded}
      beforeCommit={beforeCommit}
      afterCommit={afterCommit}
    />
  )
}
