import { memo, ReactNode } from 'react'
import { Message, MessageText, Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import { VaultPosition } from 'utils/cakePool'

import ConvertToFlexibleButton from '../Buttons/ConvertToFlexibleButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { AfterLockedActionsPropsType } from '../types'

const msg: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: null,
  [VaultPosition.Locked]: null,
  [VaultPosition.LockedEnd]: (
    <Trans>
      The lock period has ended. Convert to flexible staking or renew your position to start a new lock staking.
    </Trans>
  ),
  [VaultPosition.AfterBurning]: (
    <Trans>
      The lock period has ended. To avoid more rewards being burned, convert to flexible staking or renew your position
      to start a new lock staking.
    </Trans>
  ),
}

const AfterLockedActions: React.FC<React.PropsWithChildren<AfterLockedActionsPropsType>> = ({
  currentLockedAmount,
  stakingToken,
  position,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const isDesktopView = isInline && isDesktop
  const Container = isDesktopView ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt={!isDesktopView && '8px'} ml="10px">
          <ConvertToFlexibleButton
            mb={!isDesktopView && '8px'}
            minWidth={isDesktopView && '200px'}
            mr={isDesktopView && '14px'}
          />
          <ExtendButton
            modalTitle={t('Renew')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
            minWidth="186px"
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
      actionInline={isDesktopView}
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)
