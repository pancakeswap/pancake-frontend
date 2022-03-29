import { useMemo } from 'react'
import { Button, useModal, Message, MessageText, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import LockedStakeModal from '../LockedStakeModal'

const LockedActions = ({ pool, performanceFee, userData }) => {
  const { t } = useTranslation()
  const position = useMemo(() => getVaultPosition(userData), [userData])

  const [onPresentStake] = useModal(<LockedStakeModal pool={pool} performanceFee={performanceFee} />)

  if (position === VaultPosition.Locked) {
    return (
      <Button onClick={onPresentStake} width="100%">
        {t('Adjust')}
      </Button>
    )
  }

  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'Lock period has ended. We recommend you unlock your position or adjust it to start a new lock.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, we recommend you unlock your position or adjust it to start a new lock.',
  }

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Box mt="8px">
          <Button mb="8px" width="100%">
            {t('Switch to Flexible')}
          </Button>
          <Button onClick={onPresentStake} width="100%">
            {t('Renew')}
          </Button>
        </Box>
      }
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

export default LockedActions
