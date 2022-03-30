import { Modal, Box } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { DEFAULT_MAX_DURATION } from 'hooks/useVaultApy'

import StaticAmount from './StaticAmount'
import LockedBodyModal from './LockedBodyModal'
import Overview from './Overview'

interface ExtendDurationModal {
  stakingToken: any
  currentLockedAmount: number
  onDismiss?: () => void
  currentDuration: number
  lockStartTime: string
}

const ExtendDurationModal: React.FC<ExtendDurationModal> = ({
  stakingToken,
  onDismiss,
  currentLockedAmount,
  currentDuration,
  lockStartTime,
}) => {
  const { theme } = useTheme()
  const usdValueStaked = useBUSDCakeAmount(currentLockedAmount)

  return (
    <Modal title="Lock CAKE" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="16px">
        <StaticAmount
          stakingAddress={stakingToken.address}
          stakingSymbol={stakingToken.symbol}
          lockedAmount={currentLockedAmount}
          usdValueStaked={usdValueStaked}
        />
      </Box>
      <LockedBodyModal
        currentBalance={currentLockedAmount}
        stakingToken={stakingToken}
        onDismiss={onDismiss}
        lockedAmount={currentLockedAmount}
        validator={({ duration }) => {
          const isValidAmount = currentLockedAmount && currentLockedAmount > 0
          const totalDuration = currentDuration + duration

          const isValidDuration = duration > 0 && totalDuration > 0 && totalDuration <= DEFAULT_MAX_DURATION

          return {
            isValidAmount,
            isValidDuration,
            isOverMax: totalDuration > DEFAULT_MAX_DURATION,
          }
        }}
        prepConfirmArg={({ duration }) => ({ finalDuration: duration, finalLockedAmount: 0 })}
        customOverview={({ isValidDuration, duration }) => (
          <Overview
            lockStartTime={lockStartTime}
            isValidDuration={isValidDuration}
            openCalculator={_noop}
            duration={currentDuration}
            newDuration={currentDuration + duration}
            lockedAmount={currentLockedAmount}
            usdValueStaked={usdValueStaked}
          />
        )}
      />
    </Modal>
  )
}

export default ExtendDurationModal
