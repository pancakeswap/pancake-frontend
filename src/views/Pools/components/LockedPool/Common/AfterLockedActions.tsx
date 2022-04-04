import { memo } from 'react'
import { Message, MessageText, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { VaultPosition } from 'utils/cakePool'

import ConverToFlexibleButton from '../Buttons/ConverToFlexibleButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { AfterLockedActionsPropsType } from '../types'

const AfterLockedActions: React.FC<AfterLockedActionsPropsType> = ({
  currentLockedAmount,
  stakingToken,
  position,
  isInline,
}) => {
  const { t } = useTranslation()

  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'Lock period has ended. We recommend you unlock your position or adjust it to start a new lock.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, we recommend you unlock your position or adjust it to start a new lock.',
  }

  const Container = isInline ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt="8px">
          <ConverToFlexibleButton />
          <ExtendButton
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)
