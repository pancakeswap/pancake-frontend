import { Button, AutoRenewIcon, Box } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_MAX_DURATION } from 'hooks/useVaultApy'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from './useLockedPool'

const LockedBodyModal = ({ stakingToken, onDismiss, lockedAmount, currentBalance }) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
  })

  const isValidAmount = lockedAmount && lockedAmount > 0 && lockedAmount <= currentBalance

  const isValidDuration = duration > 0 && duration < DEFAULT_MAX_DURATION

  return (
    <>
      <Box mb="16px">
        <LockDurationField setDuration={setDuration} duration={duration} />
      </Box>
      <Overview
        isValidDuration={isValidDuration}
        openCalculator={_noop}
        duration={duration}
        lockedAmount={lockedAmount}
        usdValueStaked={usdValueStaked}
      />
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
