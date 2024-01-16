import { useMemo } from 'react'
import { styled } from 'styled-components'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { BalanceWithLoading, Box, ButtonVariant, Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { DeserializedLockedVaultUser } from 'state/types'
import { VeCakeDelegatedCard, VeCakeMigrateCard } from 'views/CakeStaking/components/SyrupPool'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import OriginalLockedInfo from '../OriginalLockedInfo'
import LockedActions from './Common/LockedActions'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'

const HelpIconWrapper = styled.div`
  align-self: center;
`

interface LockedStakingProps {
  buttonVariant?: ButtonVariant
  pool?: Pool.DeserializedPool<Token>
  userData?: DeserializedLockedVaultUser
}

const LockedStaking: React.FC<React.PropsWithChildren<LockedStakingProps>> = ({ buttonVariant, pool, userData }) => {
  const { t } = useTranslation()
  const isUserDelegated = useIsUserDelegated()
  const position = useMemo(
    // () => VaultPosition.LockedEnd,
    () =>
      getVaultPosition({
        userShares: userData?.userShares,
        locked: userData?.locked,
        lockEndTime: userData?.lockEndTime,
      }),
    [userData],
  )

  const stakingToken = pool?.stakingToken
  const stakingTokenPrice = pool?.stakingTokenPrice
  const stakingTokenBalance = pool?.userData?.stakingTokenBalance

  const currentLockedAmountAsBigNumber = useMemo(() => {
    return userData?.balance?.cakeAsBigNumber
  }, [userData?.balance?.cakeAsBigNumber])

  const currentLockedAmount = getBalanceNumber(currentLockedAmountAsBigNumber)

  const usdValueStaked = useMemo(
    () =>
      stakingToken && stakingTokenPrice
        ? getBalanceNumber(userData?.balance?.cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
        : null,
    [userData?.balance?.cakeAsBigNumber, stakingTokenPrice, stakingToken],
  )

  const { lockEndDate, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime ?? '',
    lockEndTime: userData?.lockEndTime ?? '',
    burnStartTime: userData?.burnStartTime,
  })

  const {
    targetRef: tagTargetRefOfLocked,
    tooltip: tagTooltipOfLocked,
    tooltipVisible: tagTooltipVisibleOfLocked,
  } = useTooltip(<OriginalLockedInfo pool={pool} />, {
    placement: 'bottom',
  })

  const tooltipContentOfBurn = t(
    'After Burning starts at %burnStartTime%. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.',
    { burnStartTime },
  )
  const {
    targetRef: tagTargetRefOfBurn,
    tooltip: tagTooltipOfBurn,
    tooltipVisible: tagTooltipVisibleOfBurn,
  } = useTooltip(tooltipContentOfBurn, {
    placement: 'bottom',
  })

  return (
    <Box>
      <Flex justifyContent="space-between" mb="16px">
        <Box>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('CAKE locked')}
          </Text>
          <Flex>
            <BalanceWithLoading color="text" bold fontSize="16px" value={currentLockedAmount} decimals={5} />
            {tagTooltipVisibleOfLocked && tagTooltipOfLocked}
            <HelpIconWrapper ref={tagTargetRefOfLocked}>
              <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
            </HelpIconWrapper>
          </Flex>
          <BalanceWithLoading
            value={usdValueStaked ?? 0}
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            prefix="~"
            unit=" USD"
          />
        </Box>
        <Box>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Unlocks In')}
          </Text>
          <Flex>
            <Text
              color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
              bold
              fontSize="16px"
              mr={isUserDelegated ? '10px' : '0px'}
            >
              {isUserDelegated ? t('Converted') : position >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
            </Text>
            {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
            {!isUserDelegated && (
              <span ref={tagTargetRefOfBurn}>
                <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
              </span>
            )}
          </Flex>
          <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} fontSize="12px">
            {isUserDelegated ? '-' : t('On %date%', { date: lockEndDate })}
          </Text>
        </Box>
      </Flex>
      <Box mb="16px">
        {isUserDelegated ? (
          <VeCakeDelegatedCard />
        ) : position < VaultPosition.LockedEnd ? (
          <VeCakeMigrateCard lockEndTime={userData?.lockEndTime} />
        ) : (
          <LockedActions
            userShares={userData?.userShares}
            locked={userData?.locked}
            lockEndTime={userData?.lockEndTime}
            lockStartTime={userData?.lockStartTime ?? ''}
            stakingToken={stakingToken}
            stakingTokenBalance={stakingTokenBalance ?? new BigNumber(0)}
            stakingTokenPrice={pool?.stakingTokenPrice ?? 0}
            lockedAmount={currentLockedAmountAsBigNumber ?? new BigNumber(0)}
            variant={buttonVariant}
          />
        )}
      </Box>
    </Box>
  )
}

export default LockedStaking
