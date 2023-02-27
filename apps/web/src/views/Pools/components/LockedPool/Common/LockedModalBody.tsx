import { useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button, AutoRenewIcon, Box, Flex, Message, MessageText, Text } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { MAX_LOCK_DURATION } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import { getBalanceAmount, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useIfoCeiling } from 'state/pools/hooks'
import { VaultKey } from 'state/types'

import { LockedModalBodyPropsType, ModalValidator } from '../types'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'
import useAvgLockDuration from '../hooks/useAvgLockDuration'
import { ENABLE_EXTEND_LOCK_AMOUNT } from '../../../helpers'
import { useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'

const ExtendEnable = dynamic(() => import('./ExtendEnable'), { ssr: false })

const LockedModalBody: React.FC<React.PropsWithChildren<LockedModalBodyPropsType>> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  currentDuration,
  currentDurationLeft,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
  isRenew,
}) => {
  const { t } = useTranslation()
  const ceiling = useIfoCeiling()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
    defaultDuration: isRenew && avgLockDurationsInSeconds,
  })
  const [isMaxSelected, setIsMaxSelected] = useState(false)

  const { isValidAmount, isValidDuration, isOverMax }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= MAX_LOCK_DURATION,
          isOverMax: duration > MAX_LOCK_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

  const cakeNeeded = useMemo(
    () => isValidDuration && currentDuration && currentDuration + duration > MAX_LOCK_DURATION,
    [isValidDuration, currentDuration, duration],
  )

  const hasEnoughBalanceToExtend = useMemo(() => currentBalance?.gte(ENABLE_EXTEND_LOCK_AMOUNT), [currentBalance])

  const needsEnable = useMemo(() => cakeNeeded && !hasEnoughBalanceToExtend, [cakeNeeded, hasEnoughBalanceToExtend])

  const { allowance, setLastUpdated } = useCheckVaultApprovalStatus(VaultKey.CakeVault)
  const { handleApprove, pendingTx: approvePendingTx } = useVaultApprove(VaultKey.CakeVault, setLastUpdated)
  const [showApproveWarning, setShowApproveWarning] = useState(false)

  const needsApprove = useMemo(() => {
    if (prepConfirmArg) {
      const { finalLockedAmount } = prepConfirmArg({ duration })
      if (!isUndefinedOrNull(finalLockedAmount)) {
        return getDecimalAmount(new BigNumber(finalLockedAmount)).gt(allowance)
      }
    }
    const amount = getDecimalAmount(new BigNumber(lockedAmount))
    return amount.gt(allowance)
  }, [allowance, lockedAmount, prepConfirmArg, duration])

  const [showEnableConfirmButtons, setShowEnableConfirmButtons] = useState(needsEnable)

  useEffect(() => {
    if (needsEnable) {
      setShowEnableConfirmButtons(true)
    }
  }, [needsEnable])

  useEffect(() => {
    if (!showApproveWarning && prepConfirmArg) {
      const { finalLockedAmount } = prepConfirmArg({ duration })
      if (!isUndefinedOrNull(finalLockedAmount)) {
        setShowApproveWarning(true)
      }
    }
  }, [showApproveWarning, prepConfirmArg, duration])

  return (
    <>
      <Box mb="16px">
        {editAmountOnly || (
          <>
            <LockDurationField
              isOverMax={isOverMax}
              currentDuration={currentDuration}
              currentDurationLeft={currentDurationLeft}
              setDuration={setDuration}
              duration={duration}
              isMaxSelected={isMaxSelected}
              setIsMaxSelected={setIsMaxSelected}
            />
          </>
        )}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
          isMaxSelected,
        })
      ) : (
        <Overview
          isValidDuration={isValidDuration}
          openCalculator={_noop}
          duration={duration}
          lockedAmount={lockedAmount?.toNumber()}
          usdValueStaked={usdValueStaked}
          showLockWarning
          ceiling={ceiling}
        />
      )}

      {!needsApprove && cakeNeeded ? (
        hasEnoughBalanceToExtend ? (
          <Text fontSize="12px" mt="24px">
            {t('0.0001 CAKE will be spent to extend')}
          </Text>
        ) : (
          <Message variant="warning" mt="24px">
            <MessageText maxWidth="200px">{t('0.0001 CAKE required for enabling extension')}</MessageText>
          </Message>
        )
      ) : null}

      {showApproveWarning && needsApprove ? (
        <Message variant="warning" mt="24px">
          <MessageText maxWidth="200px">{t('Insufficient token allowance. Click "Enable" to approve.')}</MessageText>
        </Message>
      ) : null}

      <Flex mt="24px" flexDirection="column">
        {needsApprove ? (
          <Button
            width="100%"
            isLoading={approvePendingTx}
            endIcon={approvePendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleApprove}
          >
            {approvePendingTx ? t('Enabling') : t('Enable')}
          </Button>
        ) : showEnableConfirmButtons ? (
          <ExtendEnable
            hasEnoughCake={hasEnoughBalanceToExtend}
            handleConfirmClick={handleConfirmClick}
            pendingConfirmTx={pendingTx}
            isValidAmount={isValidAmount}
            isValidDuration={isValidDuration}
          />
        ) : (
          <Button
            width="100%"
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleConfirmClick}
            disabled={!(isValidAmount && isValidDuration)}
          >
            {pendingTx ? t('Confirming') : t('Confirm')}
          </Button>
        )}
      </Flex>
    </>
  )
}

export default LockedModalBody
