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
      Renew your staking position to continue enjoying the benefits of farm yield boosting, participating in IFOs,
      voting power boosts, and so much more!
    </Trans>
  ),
  [VaultPosition.AfterBurning]: (
    <Trans>
      The lock period has ended. To avoid more rewards being burned, renew your staking position to continue enjoying
      the benefits from locked staking.
    </Trans>
  ),
}

const AfterLockedActions: React.FC<React.PropsWithChildren<AfterLockedActionsPropsType>> = ({
  currentLockedAmount,
  stakingToken,
  stakingTokenPrice,
  position,
  isInline,
  hideConvertToFlexibleButton,
  customLockWeekInSeconds,
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
          <ExtendButton
            modalTitle={t('Renew')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            stakingTokenPrice={stakingTokenPrice}
            currentLockedAmount={currentLockedAmount}
            minWidth="186px"
            variant="primary"
            mr={isDesktopView && '14px'}
            mb={!isDesktopView && '8px'}
            isRenew
            customLockWeekInSeconds={customLockWeekInSeconds}
          >
            {t('Renew')}
          </ExtendButton>
          {!hideConvertToFlexibleButton && <ConvertToFlexibleButton minWidth={isDesktopView && '200px'} />}
        </Container>
      }
      actionInline={isDesktopView}
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)
