import { InterfaceOrder } from 'views/Swap/utils'
import { SwapCommitButton } from './SwapCommitButton'

export type CommitButtonProps = {
  order: InterfaceOrder | undefined
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
