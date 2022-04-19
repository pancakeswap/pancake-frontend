import { useMemo } from 'react'
import { Button, AutoRenewIcon, Box, Flex } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_MAX_DURATION } from 'hooks/useVaultApy'
import { getBalanceAmount } from 'utils/formatBalance'

import { LockedModalBodyPropsType, ModalValidator } from '../types'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'

const LockedModalBody: React.FC<LockedModalBodyPropsType> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
}) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const { isValidAmount, isValidDuration, isOverMax }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= DEFAULT_MAX_DURATION,
          isOverMax: duration > DEFAULT_MAX_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

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
          lockedAmount={lockedAmount?.toNumber()}
          usdValueStaked={usdValueStaked}
        />
      )}
      <Flex mt="24px">
        <Button
          width="100%"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!(isValidAmount && isValidDuration)}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default LockedModalBody
