import { memo } from 'react'
import { Message, MessageText, Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { VaultPosition } from 'utils/cakePool'

import ConvertToFlexibleButton from '../Buttons/ConvertToFlexibleButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { AfterLockedActionsPropsType } from '../types'

const AfterLockedActions: React.FC<AfterLockedActionsPropsType> = ({
  currentLockedAmount,
  stakingToken,
  position,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'The lock period has ended. Convert to flexible staking or renew your position to start a new lock staking.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, convert to flexible staking or renew your position to start a new lock staking.',
  }
  const isTableView = isInline && !isMobile
  const Container = isTableView ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt={!isTableView && '8px'} ml="10px">
          <ConvertToFlexibleButton
            mb={!isTableView && '8px'}
            minWidth={isTableView && '200px'}
            mr={isTableView && '14px'}
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
      actionInline={isTableView}
    >
      <MessageText>{t(msg[position])}</MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)
