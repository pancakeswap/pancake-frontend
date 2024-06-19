import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, HelpIcon, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useBCakeBoostLimitAndLockInfo } from '../../hooks/bCakeV3/useBCakeV3Info'
import { BoostStatus } from '../../hooks/bCakeV3/useBoostStatus'

const BoosterTooltip = () => {
  const { t } = useTranslation()
  return (
    <>
      {t(
        `Boost multiplier is calculated based on the staking conditions from both Farms and veCAKE. Numbers will be automatically updated upon user actions.`,
      )}
    </>
  )
}

const BOOSTER_STATUS_TEXT = {
  [BoostStatus.farmCanBoostButNot]: 'READY',
  [BoostStatus.Boosted]: 'Active',
}

export const StatusView: React.FC<{
  status: BoostStatus
  boostedMultiplier?: number
  expectMultiplier?: number
  isFarmStaking?: boolean
  shouldUpdate?: boolean
  maxBoostMultiplier?: number
}> = ({ status, boostedMultiplier, isFarmStaking, shouldUpdate, expectMultiplier, maxBoostMultiplier }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { address: account, chainId } = useAccount()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<BoosterTooltip />, {
    placement: 'top',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  const { locked, isLockEnd } = useBCakeBoostLimitAndLockInfo(ChainId.BSC)
  const { isVeCakeWillSync } = useMultichainVeCakeWellSynced(chainId ?? -1)
  const bCakeMessage = useBCakeMessage(
    account,
    chainId,
    Boolean(isFarmStaking),
    locked,
    isLockEnd,
    false,
    status === BoostStatus.farmCanBoostButNot,
    status === BoostStatus.Boosted,
    shouldUpdate ?? false,
    Boolean(isVeCakeWillSync),
    (boostedMultiplier ?? 0) > 1,
  )

  return (
    <Box>
      <Text color="textSubtle" bold fontSize={12} lineHeight="120%" textTransform="uppercase">
        {t('Yield Booster')}{' '}
        <Text color="secondary" bold display="inline-block" fontSize={12} lineHeight="120%" textTransform="uppercase">
          {locked && t(BOOSTER_STATUS_TEXT[status])}
        </Text>
      </Text>
      <Flex alignItems="center">
        {!isVeCakeWillSync && chainId !== ChainId.BSC ? (
          <Text>
            {status === BoostStatus.Boosted && (boostedMultiplier ?? 0) > 1
              ? `${boostedMultiplier?.toLocaleString('en-US', {
                  maximumFractionDigits: 3,
                })}x`
              : t('Up to %boostMultiplier%x', { boostMultiplier: maxBoostMultiplier ?? 2 })}
          </Text>
        ) : shouldUpdate ? (
          <Flex>
            <Text fontSize={16} lineHeight="120%" bold color="success" mr="3px">
              {(expectMultiplier ?? 0) < 1.001 && expectMultiplier !== 1
                ? '< 1.001'
                : expectMultiplier?.toLocaleString('en-US', {
                    maximumFractionDigits: 3,
                  })}
              x
            </Text>
            <Text fontSize={16} lineHeight="120%" bold color="textSubtle" style={{ textDecoration: 'line-through' }}>
              {boostedMultiplier?.toLocaleString('en-US', {
                maximumFractionDigits: 3,
              })}
              x
            </Text>
          </Flex>
        ) : (
          <Text fontSize={16} lineHeight="120%" bold color="textSubtle">
            {(status === BoostStatus.Boosted || (status === BoostStatus.farmCanBoostButNot && isFarmStaking)) &&
            locked &&
            !isLockEnd
              ? `${
                  (boostedMultiplier ?? 0) < 1.001 && boostedMultiplier !== 1
                    ? '< 1.001'
                    : boostedMultiplier?.toLocaleString('en-US', {
                        maximumFractionDigits: 3,
                      })
                }x`
              : expectMultiplier && expectMultiplier > 1
              ? `${expectMultiplier?.toLocaleString('en-US', {
                  maximumFractionDigits: 3,
                })}x`
              : t('Up to %boostMultiplier%x', { boostMultiplier: maxBoostMultiplier ?? 2 })}
          </Text>
        )}
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
  account: `0x${string}` | undefined,
  chainId: ChainId | undefined,
  isFarmStaking: boolean,
  locked: boolean,
  isLockEnd: boolean,
  isReachedMaxBoostLimit: boolean,
  canBoostedButNot: boolean,
  boosted: boolean,
  shouldUpdate: boolean,
  isVeCakeWillSync: boolean,
  isMultiplierApplied: boolean,
) => {
  const { t } = useTranslation()
  const bCakeMessage = useMemo(() => {
    if (!account) return t('Connect wallet to activate yield booster')
    if (!isFarmStaking) {
      if (!isVeCakeWillSync) {
        return t('Sync veCAKE to activate yield booster')
      }
      return t('Start staking to activate yield booster.')
    }
    if (!locked && chainId !== ChainId.BSC) return t('Lock Cake to get veCAKE on BSC to activate yield booster.')
    if (!locked) return t('Get veCAKE to activate yield booster')
    if (!isVeCakeWillSync) {
      if (isMultiplierApplied) return t('Sync veCAKE again to update yield booster')
      return t('Sync veCAKE to activate yield booster')
    }
    if (shouldUpdate) return t('Click to update and increase your boosts.')
    if (isLockEnd) return t('Renew your CAKE staking to activate yield booster')
    if (isReachedMaxBoostLimit && canBoostedButNot) return t('Unset other boosters to activate')
    if (canBoostedButNot) return t('Yield booster available')
    if (boosted) return t('Active')
    return ''
  }, [
    t,
    account,
    isFarmStaking,
    locked,
    isLockEnd,
    isReachedMaxBoostLimit,
    canBoostedButNot,
    boosted,
    shouldUpdate,
    isVeCakeWillSync,
    isMultiplierApplied,
    chainId,
  ])
  return bCakeMessage
}
