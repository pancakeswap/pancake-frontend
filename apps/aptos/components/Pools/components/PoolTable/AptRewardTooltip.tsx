import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { useIsAptosRewardToken } from 'components/Pools/hooks/useIsAptosRewardToken'
import { useMemo } from 'react'

interface PoolEarnAptTooltipsProps {
  pool: Pool.DeserializedPool<Coin>
}

export const AptRewardTooltip: React.FunctionComponent<React.PropsWithChildren<PoolEarnAptTooltipsProps>> = ({
  pool,
}) => {
  const { t } = useTranslation()

  const { isAptosRewardToken } = useIsAptosRewardToken({
    isFinished: pool.isFinished,
    earningToken: pool.earningToken,
  })

  const lpLabel = useMemo(() => `${pool.earningToken.symbol}-${pool.stakingToken.symbol}`, [pool])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box>
        <Text lineHeight="110%" as="span">
          {t('Enjoying the %stakingToken% Staking APR? Get more rewards with the %lpLabel% LP on our', {
            lpLabel,
            stakingToken: pool.stakingToken.symbol,
          })}
          <Link ml="4px" lineHeight="110%" display="inline !important" href="/farms">
            {t('Farms')}
          </Link>
        </Text>
      </Box>
    </Box>,
    {
      placement: 'top',
    },
  )

  if (!isAptosRewardToken) {
    return null
  }

  return (
    <Box ml="6px" height="16px" style={{ alignSelf: 'center', cursor: 'pointer' }}>
      <TooltipText ref={targetRef}>
        <Text fontSize={14}>🎁</Text>
      </TooltipText>
      {tooltipVisible && tooltip}
    </Box>
  )
}
