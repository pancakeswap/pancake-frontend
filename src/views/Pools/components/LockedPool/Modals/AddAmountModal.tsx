import { useState, useCallback } from 'react'
import { differenceInSeconds } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { Modal, Box, MessageText, Message, Checkbox, Flex, Text } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { useIfoCeiling } from 'state/pools/hooks'
import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber, getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import { ONE_WEEK_DEFAULT } from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'

import RoiCalculatorModalProvider from './RoiCalculatorModalProvider'

import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'
import Overview from '../Common/Overview'
import { AddAmountModalProps } from '../types'

const RenewDuration = ({ setCheckedState, checkedState }) => {
  const { t } = useTranslation()

  return (
    <>
      {!checkedState && (
        <Message variant="warning" mb="16px">
          <MessageText maxWidth="320px">
            {t(
              'Adding more CAKE will renew your lock, setting it to remaining duration. Due to shorter lock period, benefits decrease. To keep similar benefits, extend your lock.',
            )}
          </MessageText>
        </Message>
      )}
      <Flex alignItems="center">
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          {t('Renew and extend your lock to keep similar benefits.')}
        </Text>
      </Flex>
    </>
  )
}
// add 60s buffer in order to make sure minium duration by pass on renew extension
const MIN_DURATION_BUFFER = 60

const AddAmountModal: React.FC<AddAmountModalProps> = ({
  onDismiss,
  currentBalance,
  currentLockedAmount,
  stakingToken,
  lockStartTime,
  lockEndTime,
  stakingTokenBalance,
}) => {
  const { theme } = useTheme()
  const ceiling = useIfoCeiling()
  const [lockedAmount, setLockedAmount] = useState('')
  const [checkedState, setCheckedState] = useState(false)
  const { t } = useTranslation()
  const lockedAmountAsBigNumber = !Number.isNaN(new BigNumber(lockedAmount).toNumber())
    ? new BigNumber(lockedAmount)
    : BIG_ZERO
  const totalLockedAmount: number = getBalanceNumber(
    currentLockedAmount.plus(getDecimalAmount(lockedAmountAsBigNumber)),
  )
  const currentLockedAmountAsBalance = getBalanceAmount(currentLockedAmount)

  const usdValueStaked = useBUSDCakeAmount(lockedAmountAsBigNumber.toNumber())
  const usdValueNewStaked = useBUSDCakeAmount(totalLockedAmount)

  const remainingDuration = differenceInSeconds(new Date(convertTimeToSeconds(lockEndTime)), new Date(), {
    roundingMethod: 'ceil',
  })
  const passedDuration = differenceInSeconds(new Date(), new Date(convertTimeToSeconds(lockStartTime)), {
    roundingMethod: 'ceil',
  })

  // if you locked for 1 week, then add cake without renew the extension, it's possible that remainingDuration + passedDuration less than 1 week.
  const atLeastOneWeekNewDuration = Math.max(ONE_WEEK_DEFAULT + MIN_DURATION_BUFFER, remainingDuration + passedDuration)

  const prepConfirmArg = useCallback(() => {
    const extendDuration = atLeastOneWeekNewDuration - remainingDuration
    return {
      finalDuration: checkedState ? extendDuration : 0,
    }
  }, [atLeastOneWeekNewDuration, checkedState, remainingDuration])

  const customOverview = useCallback(
    () => (
      <Overview
        isValidDuration
        openCalculator={_noop}
        duration={remainingDuration}
        newDuration={checkedState ? atLeastOneWeekNewDuration : null}
        lockedAmount={currentLockedAmountAsBalance.toNumber()}
        newLockedAmount={totalLockedAmount}
        usdValueStaked={usdValueNewStaked}
        lockEndTime={lockEndTime}
        ceiling={ceiling}
      />
    ),
    [
      remainingDuration,
      checkedState,
      currentLockedAmountAsBalance,
      atLeastOneWeekNewDuration,
      totalLockedAmount,
      usdValueNewStaked,
      lockEndTime,
      ceiling,
    ],
  )

  return (
    <RoiCalculatorModalProvider lockedAmount={lockedAmount}>
      <Modal
        style={{ maxWidth: '420px' }}
        title={t('Add CAKE')}
        onDismiss={onDismiss}
        headerBackground={theme.colors.gradients.cardHeader}
      >
        <Box mb="16px">
          <BalanceField
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            stakingDecimals={stakingToken.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
          />
        </Box>
        <LockedBodyModal
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          onDismiss={onDismiss}
          lockedAmount={lockedAmountAsBigNumber}
          editAmountOnly={<RenewDuration checkedState={checkedState} setCheckedState={setCheckedState} />}
          prepConfirmArg={prepConfirmArg}
          customOverview={customOverview}
        />
      </Modal>
    </RoiCalculatorModalProvider>
  )
}

export default AddAmountModal
