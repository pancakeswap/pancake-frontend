import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Button, AutoRenewIcon, Box, Flex, Message, MessageText, Text } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { MAX_LOCK_DURATION } from 'config/constants/pools'
import { getBalanceAmount } from 'utils/formatBalance'
import { useIfoCeiling } from 'state/pools/hooks'

import { LockedModalBodyPropsType, ModalValidator } from '../types'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'
import { MIN_LOCK_AMOUNT } from '../../../helpers'

const ExtendEnable = dynamic(() => import('./ExtendEnable'), { ssr: false })

const LockedModalBody: React.FC<LockedModalBodyPropsType> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  extendLockedPosition,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
}) => {
  const { t } = useTranslation()
  const ceiling = useIfoCeiling()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const {
    isValidAmount,
    isValidDuration,
    isOverMax,
    maxAvailableDuration,
    currentDuration,
    currentDurationLeft,
  }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= MAX_LOCK_DURATION,
          isOverMax: duration > MAX_LOCK_DURATION,
          maxAvailableDuration: MAX_LOCK_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

  const cakeNeeded = useMemo(
    () => isValidDuration && extendLockedPosition && currentDuration + duration > MAX_LOCK_DURATION,
    [isValidDuration, extendLockedPosition, currentDuration, duration],
  )

  const hasEnoughBalanceToExtend = useMemo(() => currentBalance?.gte(MIN_LOCK_AMOUNT), [currentBalance])

  const needsEnable = useMemo(() => cakeNeeded && !hasEnoughBalanceToExtend, [cakeNeeded, hasEnoughBalanceToExtend])

  return (
    <>
      <Box mb="16px">
        {editAmountOnly || (
          <>
            <LockDurationField
              isOverMax={isOverMax}
              maxAvailableDuration={maxAvailableDuration}
              setDuration={setDuration}
              duration={duration}
              extendLockedPosition
              currentDurationLeft={currentDurationLeft}
            />
          </>
        )}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
          updatedLockStartTime: currentDuration + duration > MAX_LOCK_DURATION ? Date.now() / 1000 : null,
          updatedNewDuration: currentDuration + duration > MAX_LOCK_DURATION ? MAX_LOCK_DURATION : null,
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

      {cakeNeeded &&
        (hasEnoughBalanceToExtend ? (
          <Text fontSize="12px" mt="24px">
            {t('0.0001 CAKE will be spent to extend')}
          </Text>
        ) : (
          <Message variant="warning">
            <MessageText maxWidth="200px">{t('0.0001 CAKE required for enabling extension')}</MessageText>
          </Message>
        ))}

      <Flex mt="24px">
        {needsEnable ? (
          <ExtendEnable isValidAmount={isValidAmount} isValidDuration={isValidDuration} />
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
