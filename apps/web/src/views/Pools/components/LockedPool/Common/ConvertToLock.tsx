import { Token } from '@pancakeswap/sdk'
import { Flex, Message, MessageText, useMatchBreakpoints, SkeletonV2 } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'
import { useVaultApy } from 'hooks/useVaultApy'

import ExtendButton from '../Buttons/ExtendDurationButton'
import useAvgLockDuration from '../hooks/useAvgLockDuration'

interface ConvertToLockProps {
  stakingToken: Token
  currentStakedAmount: number
  isInline?: boolean
}

const ConvertToLock: React.FC<React.PropsWithChildren<ConvertToLockProps>> = ({
  stakingToken,
  currentStakedAmount,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const isTableView = isInline && !isMobile
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { lockedApy } = useVaultApy({ duration: avgLockDurationsInSeconds })

  return (
    <Message
      variant="warning"
      action={
        <Flex mt={!isTableView && '8px'} flexGrow={1} ml={isTableView && '80px'}>
          <ExtendButton
            modalTitle={t('Convert to Lock')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentStakedAmount}
          >
            {t('Convert to Lock')}
          </ExtendButton>
        </Flex>
      }
      actionInline={isTableView}
    >
      <SkeletonV2 isDataReady={!!(avgLockDurationsInSeconds && lockedApy)} wrapperProps={{ height: 'fit-content' }}>
        <MessageText>
          {t('Lock staking users are earning an average of %amount%% APR. More benefits are coming soon.', {
            amount: lockedApy ? parseFloat(lockedApy).toFixed(2) : 0,
          })}
        </MessageText>
      </SkeletonV2>
    </Message>
  )
}

export default memo(ConvertToLock)
