import { useCallback } from 'react'
import { Modal, Box } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { MAX_LOCK_DURATION } from 'config/constants/pools'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { useIfoCeiling } from 'state/pools/hooks'

import { getBalanceAmount } from 'utils/formatBalance'
import StaticAmount from '../Common/StaticAmount'
import LockedBodyModal from '../Common/LockedModalBody'
import Overview from '../Common/Overview'
import { ExtendDurationModal } from '../types'
import RoiCalculatorModalProvider from './RoiCalculatorModalProvider'
import { MIN_LOCK_AMOUNT } from '../../../helpers'

const ExtendDurationModal: React.FC<ExtendDurationModal> = ({
  modalTitle,
  stakingToken,
  onDismiss,
  currentLockedAmount,
  currentDuration,
  currentBalance,
  lockStartTime,
  lockEndTime,
}) => {
  const { theme } = useTheme()
  const ceiling = useIfoCeiling()
  const { t } = useTranslation()

  const usdValueStaked = useBUSDCakeAmount(currentLockedAmount)

  const validator = useCallback(
    ({ duration }) => {
      const isValidAmount = currentLockedAmount && currentLockedAmount > 0
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const currentDurationLeft = Math.max(Number(lockEndTime) - nowInSeconds, 0)
      const totalDuration = currentDurationLeft + duration

      const isValidDuration = duration > 0 && totalDuration > 0 && totalDuration <= MAX_LOCK_DURATION

      return {
        isValidAmount,
        isValidDuration,
        isOverMax: totalDuration > MAX_LOCK_DURATION,
      }
    },
    [currentLockedAmount, lockEndTime],
  )

  const prepConfirmArg = useCallback(
    ({ duration }) => ({
      finalDuration: duration,
      finalLockedAmount:
        currentDuration && currentDuration + duration > MAX_LOCK_DURATION
          ? getBalanceAmount(MIN_LOCK_AMOUNT, stakingToken.decimals).toNumber()
          : 0,
    }),
    [stakingToken.decimals, currentDuration],
  )

  const customOverview = useCallback(
    ({ isValidDuration, duration, updatedLockStartTime, updatedLockDuration }) => (
      <Overview
        lockStartTime={updatedLockStartTime || lockStartTime}
        isValidDuration={isValidDuration}
        openCalculator={_noop}
        duration={currentDuration || duration}
        newDuration={updatedLockDuration || currentDuration + duration}
        lockedAmount={currentLockedAmount}
        usdValueStaked={usdValueStaked}
        showLockWarning={!+lockStartTime}
        ceiling={ceiling}
      />
    ),
    [lockStartTime, currentDuration, currentLockedAmount, usdValueStaked, ceiling],
  )

  return (
    <RoiCalculatorModalProvider lockedAmount={currentLockedAmount}>
      <Modal
        title={modalTitle || t('Extend Lock')}
        onDismiss={onDismiss}
        headerBackground={theme.colors.gradients.cardHeader}
      >
        <Box mb="16px">
          <StaticAmount
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            lockedAmount={currentLockedAmount}
            usdValueStaked={usdValueStaked}
          />
        </Box>
        <LockedBodyModal
          stakingToken={stakingToken}
          currentBalance={currentBalance}
          currentDuration={currentDuration}
          lockEndTime={lockEndTime}
          onDismiss={onDismiss}
          lockedAmount={new BigNumber(currentLockedAmount)}
          validator={validator}
          prepConfirmArg={prepConfirmArg}
          customOverview={customOverview}
        />
      </Modal>
    </RoiCalculatorModalProvider>
  )
}

export default ExtendDurationModal
