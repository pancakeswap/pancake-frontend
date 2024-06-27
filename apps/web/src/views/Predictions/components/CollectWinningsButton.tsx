import { Button, ButtonProps, useModal } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { fetchNodeHistory } from 'state/predictions'
import { useCollectWinningModalProps } from 'state/predictions/hooks'
import { useAccount } from 'wagmi'
import { useConfig } from '../context/ConfigProvider'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  hasClaimed: boolean

  /**
   * Success Callback.
   * Note: fetchNodeHistory is called after this callback to refetch the history
   */
  onSuccess?: () => Promise<void>
}

const CollectWinningsButton: React.FC<React.PropsWithChildren<CollectWinningsButtonProps>> = ({
  hasClaimed,
  onSuccess,
  children,
  ...props
}) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { history, isLoadingHistory } = useCollectWinningModalProps()
  const dispatch = useLocalDispatch()
  const config = useConfig()
  const predictionsAddress = config?.address ?? '0x'
  const isNativeToken = config?.isNativeToken ?? false

  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal
      dispatch={dispatch}
      history={history}
      isLoadingHistory={isLoadingHistory}
      onSuccess={async () => {
        await onSuccess?.()
        if (account) dispatch(fetchNodeHistory({ account, chainId }))
      }}
      predictionsAddress={predictionsAddress}
      token={config?.token}
      isNativeToken={isNativeToken}
    />,
    false,
    true,
    'CollectRoundWinningsModal',
  )

  return (
    <Button onClick={onPresentCollectWinningsModal} disabled={hasClaimed} {...props}>
      {children}
    </Button>
  )
}

export default CollectWinningsButton
