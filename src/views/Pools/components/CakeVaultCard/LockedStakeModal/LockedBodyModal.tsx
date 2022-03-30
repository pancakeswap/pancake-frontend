import { useState, useEffect } from 'react'
import { Button, AutoRenewIcon, Box, Checkbox, Flex, Text, Message, MessageText } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_MAX_DURATION } from 'hooks/useVaultApy'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from './useLockedPool'

const RenewDuration = ({ setDuration }) => {
  const [checkedState, setCheckedState] = useState(false)

  useEffect(() => {
    if (checkedState) {
      // How much for the extend
      setDuration(DEFAULT_MAX_DURATION)
    }
  }, [checkedState, setDuration])

  return (
    <>
      {!checkedState && (
        <Message variant="warning" mb="16px">
          <MessageText>
            Adding more CAKE will renew your lock, setting it to remaining duration. Due to shorter lock period,
            benefits decrease. To keep similar benefits, extend your lock. Learn more
          </MessageText>
        </Message>
      )}
      <Flex alignItems="center">
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          Renew and extend your lock to keep similar benefits.
        </Text>
      </Flex>
    </>
  )
}

const LockedBodyModal = ({ stakingToken, onDismiss, lockedAmount, currentBalance, editAmountOnly }) => {
  const { t } = useTranslation()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
  })

  const isValidAmount = lockedAmount && lockedAmount > 0 && lockedAmount <= currentBalance

  const isValidDuration = duration > 0 && duration <= DEFAULT_MAX_DURATION

  return (
    <>
      <Box mb="16px">
        {editAmountOnly ? (
          <RenewDuration setDuration={setDuration} />
        ) : (
          <LockDurationField setDuration={setDuration} duration={duration} />
        )}
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
