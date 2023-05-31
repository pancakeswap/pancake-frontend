import { Box, Text, useTooltip, useMatchBreakpoints, LinkExternal, HelpIcon, Flex } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { BoostStatus } from '../../hooks/bCakeV3/useBoostStatus'
import { useBCakeBoostLimitAndLockInfo } from '../../hooks/bCakeV3/useBCakeV3Info'

const BoosterTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t(
        `Boost multiplier is calculated based on the staking conditions from both Farms and fixed-term CAKE syrup pool and will be automatically updated upon user actions.`,
      )}
      <LinkExternal
        href="https://docs.pancakeswap.finance/products/yield-farming/bcake/faq#how-are-the-bcake-multipliers-calculated"
        external
      >
        {t('Learn More')}
      </LinkExternal>
    </>
  )
}

export const StatusView: React.FC<{ status: BoostStatus; boostedMultiplier?: number; isFarmStaking?: boolean }> = ({
  status,
  boostedMultiplier,
  isFarmStaking,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { account } = useActiveWeb3React()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<BoosterTooltip />, {
    placement: 'top',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  const { locked, isLockEnd, isReachedMaxBoostLimit } = useBCakeBoostLimitAndLockInfo()

  return (
    <Box>
      <Text color="textSubtle" bold fontSize={12} lineHeight="120%" textTransform="uppercase">
        {t('Yield Booster')}
      </Text>
      <Flex alignItems="center">
        <Text fontSize={16} lineHeight="120%" bold color="textSubtle">
          {status === BoostStatus.Boosted ||
          (status === BoostStatus.farmCanBoostButNot && isFarmStaking && locked && !isLockEnd)
            ? `${boostedMultiplier}x`
            : t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
        </Text>
        <Flex ref={targetRef}>
          <HelpIcon color="textSubtle" width="20px" height="20px" />
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
      <Text color="textSubtle" fontSize={12} lineHeight="120%">
        {!account && t('Connect wallet to activate yield booster')}
        {account && !isFarmStaking && t('Start staking to activate yield booster.')}
        {account && isFarmStaking && !locked && t('Lock CAKE to activate yield booster')}
        {account && isFarmStaking && isLockEnd && t('Renew your CAKE staking to activate yield booster')}
        {account && isFarmStaking && isReachedMaxBoostLimit && t('Unset other boosters to activate')}
        {account && status === BoostStatus.farmCanBoostButNot && isFarmStaking && t('Yield booster available')}
        {account && status === BoostStatus.Boosted && t('Active')}
      </Text>
    </Box>
  )
}
