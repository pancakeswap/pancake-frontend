import { useMemo } from 'react'
import { Button, useModal, Message, MessageText, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'

import LockedStakeModal from '../LockedStakeModal'
import StaticLockedModal from '../LockedStakeModal/StaticLockedModal'

const LockedActions = ({ userData, stakingToken, stakingTokenBalance }) => {
  const { t } = useTranslation()
  const position = useMemo(() => getVaultPosition(userData), [userData])
  const cakeBalance = getBalanceNumber(userData?.lockedAmount)

  const currentBalance = useMemo(
    () => (stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO),
    [stakingTokenBalance],
  )

  const [openLockedStakeModal] = useModal(
    <LockedStakeModal currentBalance={currentBalance} stakingToken={stakingToken} />,
  )

  const [openStaticLockedModal] = useModal(<StaticLockedModal stakingToken={stakingToken} lockedAmount={cakeBalance} />)

  if (position === VaultPosition.Locked) {
    return (
      <Button onClick={() => openLockedStakeModal()} width="100%">
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
          <Button onClick={() => openLockedStakeModal()} width="100%">
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
