import { useState, useEffect } from 'react'
import { Button, AutoRenewIcon, Box, Checkbox, Flex, Text, Message, MessageText } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_MAX_DURATION } from 'hooks/useVaultApy'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from './useLockedPool'

const LockedBodyModal = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  editAmountOnly = null,
  prepConfirmArg = null,
  validator = null,
  customOverview = null,
}) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const { isValidAmount, isValidDuration, isOverMax } =
    typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount && lockedAmount > 0 && lockedAmount <= currentBalance,
          isValidDuration: duration > 0 && duration <= DEFAULT_MAX_DURATION,
          isOverMax: duration > DEFAULT_MAX_DURATION,
        }

  return (
    <>
      <Box mb="16px">
        {editAmountOnly || <LockDurationField isOverMax={isOverMax} setDuration={setDuration} duration={duration} />}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
        })
      ) : (
        <Overview
          isValidDuration={isValidDuration}
          openCalculator={_noop}
          duration={duration}
          lockedAmount={lockedAmount}
          usdValueStaked={usdValueStaked}
        />
      )}
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!(isValidAmount && isValidDuration)}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </>
  )
}

export default LockedBodyModal
