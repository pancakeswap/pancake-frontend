import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Box, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { BalanceWithLoading } from 'components/Balance'
import Divider from 'components/Divider'
import { getCakeVaultEarnings, convertSharesToCake } from 'views/Pools/helpers'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'

import BurningCountDown from './Common/BurningCountDown'
import BurnedCake from './Common/BurnedCake'
import LockedActions from './Common/LockedActions'
import useUserDataInVaultPrensenter from './hooks/useUserDataInVaultPrensenter'
import { LockedStakingApyPropsType } from './types'

const LockedStakingApy: React.FC<LockedStakingApyPropsType> = ({
  stakingToken,
  stakingTokenBalance,
  userData,
  account,
  earningTokenPrice,
  pricePerFullShare,
}) => {
  const { t } = useTranslation()
  const position = useMemo(
    () =>
      getVaultPosition({
        userShares: userData?.userShares,
        locked: userData?.locked,
        lockEndTime: userData?.lockEndTime,
      }),
    [userData],
  )

  // TODO: Locked Cake Amount not match with Flexible Cake Amount
  // When extending, the staked amount is increased. Does it make sense ?
  const { cakeAsNumberBalance } = convertSharesToCake(userData?.userShares, pricePerFullShare)
  const usdValueStaked = useBUSDCakeAmount(cakeAsNumberBalance)

  const { weekDuration, lockEndDate, secondDuration, remainingWeeks } = useUserDataInVaultPrensenter({
    lockStartTime: userData?.lockStartTime,
    lockEndTime: userData?.lockEndTime,
  })

  const { lockedApy } = useVaultApy({ duration: Number(secondDuration) })

  const tooltipContent = t(
    'Your yield will be boosted based on the total lock duration of your current fixed term staking position.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  // TODO: Check if we need to minus fee
  let earningTokenBalance = 0
  if (pricePerFullShare) {
    const { autoCakeToDisplay } = getCakeVaultEarnings(
      account,
      userData?.cakeAtLastUserAction,
      userData?.userShares,
      pricePerFullShare,
      earningTokenPrice,
    )
    earningTokenBalance = autoCakeToDisplay
  }

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="16px">
        <Box>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('CAKE locked')}
          </Text>
          <BalanceWithLoading color="text" bold fontSize="16px" value={cakeAsNumberBalance} decimals={2} />
          <BalanceWithLoading
            value={usdValueStaked}
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
          <Text
            color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
            textTransform="uppercase"
            bold
            fontSize="16px"
          >
            {remainingWeeks}
          </Text>
          <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} fontSize="12px">
            {t(`Until %date%`, { date: lockEndDate })}
          </Text>
        </Box>
      </Flex>
      <Box mb="16px">
        <LockedActions
          pricePerFullShare={pricePerFullShare}
          userShares={userData?.userShares}
          locked={userData?.locked}
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          stakingTokenBalance={stakingTokenBalance}
        />
      </Box>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('APY')}
        </Text>
        <BalanceWithLoading color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <TooltipText>
          <Text ref={targetRef} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Initial Lock Duration')}
          </Text>
        </TooltipText>
        <Text color="text" bold fontSize="16px">
          {weekDuration}
        </Text>
      </Flex>
      {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Recent CAKE profit')}
          </Text>
          <BalanceWithLoading color="text" bold fontSize="16px" value={earningTokenBalance} decimals={2} />
        </Flex>
      )}
      {position === VaultPosition.LockedEnd && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After Burning In')}
          </Text>
          <Text color="textSubtle" bold>
            <BurningCountDown lockEndTime={userData?.lockEndTime} />
          </Text>
        </Flex>
      )}
      {position === VaultPosition.AfterBurning && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After burning')}
          </Text>
          <Text color="textSubtle" bold>
            <BurnedCake account={account} />
          </Text>
        </Flex>
      )}
    </LightGreyCard>
  )
}

export default memo(LockedStakingApy)
