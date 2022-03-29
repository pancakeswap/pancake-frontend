import { Button, AutoRenewIcon, Box } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from './useLockedPool'

const LockedBodyModal = ({ stakingToken, onDismiss, lockedAmount }) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
  })

  return (
    <>
      <Box mb="16px">
        <LockDurationField setDuration={setDuration} duration={duration} />
      </Box>
      <Overview
        openCalculator={_noop}
        weekDuration={duration}
        lockedAmount={lockedAmount}
        usdValueStaked={usdValueStaked}
      />
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!lockedAmount || lockedAmount === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </>
  )
}

export default LockedBodyModal
