import { Modal, Box } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'

import StaticAmount from './StaticAmount'
import LockedBodyModal from './LockedBodyModal'

interface ExtendDurationModal {
  stakingToken: any
  lockedAmount: number
  onDismiss?: () => void
}

const ExtendDurationModal: React.FC<ExtendDurationModal> = ({ stakingToken, onDismiss, lockedAmount }) => {
  const { theme } = useTheme()
  const usdValueStaked = useBUSDCakeAmount(lockedAmount)

  return (
    <Modal title="Lock CAKE" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="16px">
        <StaticAmount
          stakingAddress={stakingToken.address}
          stakingSymbol={stakingToken.symbol}
          lockedAmount={lockedAmount}
          usdValueStaked={usdValueStaked}
        />
      </Box>
      <LockedBodyModal
        currentBalance={lockedAmount}
        stakingToken={stakingToken}
        onDismiss={onDismiss}
        lockedAmount={lockedAmount}
      />
    </Modal>
  )
}

export default ExtendDurationModal
