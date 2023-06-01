import { Box, Text, useTooltip, useMatchBreakpoints, LinkExternal, HelpIcon, Flex } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
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
  const bCakeMessage = useBCakeMessage(
    account,
    Boolean(isFarmStaking),
    locked,
    isLockEnd,
    isReachedMaxBoostLimit,
    status === BoostStatus.farmCanBoostButNot,
    status === BoostStatus.Boosted,
  )

  return (
    <Box>
      <Text color="textSubtle" bold fontSize={12} lineHeight="120%" textTransform="uppercase">
        {t('Yield Booster')}
      </Text>
      <Flex alignItems="center">
        <Text fontSize={16} lineHeight="120%" bold color="textSubtle">
          {status === BoostStatus.Boosted ||
          (status === BoostStatus.farmCanBoostButNot && isFarmStaking && locked && !isLockEnd)
            ? `${
                boostedMultiplier < 1.001 && boostedMultiplier !== 1
                  ? '< 1.001'
                  : boostedMultiplier?.toLocaleString('en-US', {
                      maximumFractionDigits: 3,
                    })
              }x`
            : t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
        </Text>
        <Flex ref={targetRef}>
          <HelpIcon color="textSubtle" width="20px" height="20px" />
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
      <Text color="textSubtle" fontSize={12} lineHeight="120%">
        {bCakeMessage}
      </Text>
    </Box>
  )
}

const useBCakeMessage = (
  account: `0x${string}`,
  isFarmStaking: boolean,
  locked: boolean,
  isLockEnd: boolean,
  isReachedMaxBoostLimit: boolean,
  canBoostedButNot: boolean,
  boosted: boolean,
) => {
  const { t } = useTranslation()
  const bCakeMessage = useMemo(() => {
    if (!account) return t('Connect wallet to activate yield booster')
    if (!isFarmStaking) return t('Start staking to activate yield booster.')
    if (!locked) return t('Lock CAKE to activate yield booster')
    if (isLockEnd) return t('Renew your CAKE staking to activate yield booster')
    if (isReachedMaxBoostLimit && canBoostedButNot) return t('Unset other boosters to activate')
    if (canBoostedButNot) return t('Yield booster available')
    if (boosted) return t('Active')
    return ''
  }, [t, account, isFarmStaking, locked, isLockEnd, isReachedMaxBoostLimit, canBoostedButNot, boosted])
  return bCakeMessage
}
