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
  lockedAmount: number
  onDismiss?: () => void
  currentDuration: number
  lockStartTime: string
}

const ExtendDurationModal: React.FC<ExtendDurationModal> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentDuration,
  lockStartTime,
}) => {
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
        validator={({ duration }) => {
          const isValidAmount = lockedAmount && lockedAmount > 0
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
            lockedAmount={lockedAmount}
            usdValueStaked={usdValueStaked}
          />
        )}
      />
    </Modal>
  )
}

export default ExtendDurationModal
