import { Button, ButtonProps, useModal } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useCollectWinningModalProps } from 'state/predictions/hooks'
import { useConfig } from '../context/ConfigProvider'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  hasClaimed: boolean
  onSuccess?: () => Promise<void>
}

const CollectWinningsButton: React.FC<CollectWinningsButtonProps> = ({ hasClaimed, onSuccess, children, ...props }) => {
  const { history, isLoadingHistory } = useCollectWinningModalProps()
  const dispatch = useLocalDispatch()
  const { address: predictionsAddress, token } = useConfig()

  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal
      dispatch={dispatch}
      history={history}
      isLoadingHistory={isLoadingHistory}
      onSuccess={onSuccess}
      predictionsAddress={predictionsAddress}
      token={token}
    />,
    false,
    true,
  )

  return (
    <Button onClick={onPresentCollectWinningsModal} disabled={hasClaimed} {...props}>
      {children}
    </Button>
  )
}

export default CollectWinningsButton
