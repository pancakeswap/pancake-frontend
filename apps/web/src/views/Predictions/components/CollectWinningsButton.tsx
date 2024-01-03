import { Button, ButtonProps, useModal } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useCollectWinningModalProps } from 'state/predictions/hooks'
import { useConfig } from '../context/ConfigProvider'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  hasClaimed: boolean
  onSuccess?: () => Promise<void>
}

const CollectWinningsButton: React.FC<React.PropsWithChildren<CollectWinningsButtonProps>> = ({
  hasClaimed,
  onSuccess,
  children,
  ...props
}) => {
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
      onSuccess={onSuccess}
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
