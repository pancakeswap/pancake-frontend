import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, TooltipText, WarningIcon, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { useIsAptosRewardToken } from 'components/Pools/hooks/useIsAptosRewardToken'

interface UsUserAptRewardTooltips {
  pool: Pool.DeserializedPool<Coin>
}

export const UsUserAptRewardTooltips: React.FunctionComponent<React.PropsWithChildren<UsUserAptRewardTooltips>> = ({
  pool,
}) => {
  const { t } = useTranslation()

  const { isUSUserWithAptosReward } = useIsAptosRewardToken({
    isFinished: pool.isFinished,
    earningToken: pool.earningToken,
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box mt="4px">
        <Text lineHeight="110%" as="span">
          {t('The rewards for this Syrup Pool will not be applicable to or claimable by')}
        </Text>
        <Text bold lineHeight="110%" ml="4px" as="span" color="failure">
          {t('U.S.-based and VPN users.')}
        </Text>
      </Box>
    </Box>,
    {
      placement: 'top',
    },
  )

  if (!isUSUserWithAptosReward) {
    return null
  }

  return (
    <Box>
      <TooltipText ref={targetRef}>
        <WarningIcon m="0 4px" color="failure" width="20px" />
      </TooltipText>
      {tooltipVisible && tooltip}
    </Box>
  )
}
