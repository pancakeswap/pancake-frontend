import { useState, useCallback, useMemo, useEffect } from 'react'
import dayjs from 'dayjs'
import { convertTimeToMilliseconds } from 'utils/timeHelper'
import { Modal, Box, MessageText, Message, Checkbox, Flex, Text } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useIfoCeiling } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber, getDecimalAmount, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

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
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev: any) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          {t('Renew and extend your lock to keep similar benefits.')}
        </Text>
      </Flex>
    </>
  )
}
// add 60s buffer in order to make sure minimum duration by pass on renew extension
const MIN_DURATION_BUFFER = 60

const AddAmountModal: React.FC<React.PropsWithChildren<AddAmountModalProps>> = ({
  onDismiss,
  currentBalance,
  currentLockedAmount,
  stakingToken,
  lockStartTime,
  lockEndTime,
  stakingTokenBalance,
  stakingTokenPrice,
  customLockAmount,
}) => {
  const { theme } = useTheme()
  const ceiling = useIfoCeiling()
  const [lockedAmount, setLockedAmount] = useState('')
  const [checkedState, setCheckedState] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (customLockAmount) {
      setLockedAmount(customLockAmount)
    }
  }, [customLockAmount])

  const lockedAmountAsBigNumber = useMemo(
    () => (!Number.isNaN(new BigNumber(lockedAmount).toNumber()) ? new BigNumber(lockedAmount) : BIG_ZERO),
    [lockedAmount],
  )

  const totalLockedAmountBN = useMemo(
    () => currentLockedAmount.plus(getDecimalAmount(lockedAmountAsBigNumber)),
    [currentLockedAmount, lockedAmountAsBigNumber],
  )

  const totalLockedAmount: number = useMemo(
    () => getBalanceNumber(totalLockedAmountBN, stakingToken.decimals),
    [totalLockedAmountBN, stakingToken.decimals],
  )

  const currentLockedAmountAsBalance = useMemo(() => getBalanceAmount(currentLockedAmount), [currentLockedAmount])

  const usdValueStaked = useMemo(
    () =>
      getBalanceNumber(
        getDecimalAmount(lockedAmountAsBigNumber, stakingToken.decimals).multipliedBy(stakingTokenPrice),
        stakingToken.decimals,
      ),
    [lockedAmountAsBigNumber, stakingTokenPrice, stakingToken.decimals],
  )

  const usdValueNewStaked = useMemo(
    () => getBalanceNumber(totalLockedAmountBN.multipliedBy(stakingTokenPrice), stakingToken.decimals),
    [totalLockedAmountBN, stakingTokenPrice, stakingToken.decimals],
  )

  const remainingDuration = dayjs(convertTimeToMilliseconds(lockEndTime || '')).diff(dayjs(), 'seconds')
  const passedDuration = dayjs().diff(dayjs(convertTimeToMilliseconds(lockStartTime || '')), 'seconds')

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
        newDuration={checkedState ? atLeastOneWeekNewDuration : undefined}
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

  const { allowance } = useCheckVaultApprovalStatus(VaultKey.CakeVault)
  const needApprove = useMemo(() => {
    const amount = getDecimalAmount(new BigNumber(lockedAmount))
    return amount.gt(allowance)
  }, [allowance, lockedAmount])

  return (
    <RoiCalculatorModalProvider lockedAmount={lockedAmount}>
      <Modal title={t('Add CAKE')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
        <Box mb="16px">
          <BalanceField
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            stakingDecimals={stakingToken.decimals}
            lockedAmount={lockedAmount}
            usdValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
            needApprove={needApprove}
          />
        </Box>
        <LockedBodyModal
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          stakingTokenPrice={stakingTokenPrice}
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
