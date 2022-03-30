import { useMemo } from 'react'
import { Button, useModal, Message, MessageText, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'

import LockedStakeModal from '../LockedStakeModal'
import ExtendDurationModal from '../LockedStakeModal/ExtendDurationModal'
import AddAmountModal from '../LockedStakeModal/AddAmountModal'

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

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal stakingToken={stakingToken} lockedAmount={cakeBalance} />,
  )

  const [openAddAmountModal] = useModal(<AddAmountModal currentBalance={currentBalance} stakingToken={stakingToken} />)

  if (position !== VaultPosition.Locked) {
    return (
      <Flex>
        <Button onClick={() => openAddAmountModal()} width="100%">
          {t('Add Cake')}
        </Button>
        <Button ml="16px" onClick={() => openExtendDurationModal()} width="100%">
          {t('Extend')}
        </Button>
      </Flex>
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
