import styled from 'styled-components'
import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Box, TooltipText, useTooltip, HelpIcon, BalanceWithLoading, Pool } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useVaultApy } from 'hooks/useVaultApy'
import Divider from 'components/Divider'
import { Token } from '@pancakeswap/sdk'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BurningCountDown from './Common/BurningCountDown'
import LockedActions from './Common/LockedActions'
import YieldBoostRow from './Common/YieldBoostRow'
import LockDurationRow from './Common/LockDurationRow'
import IfoCakeRow from './Common/IfoCakeRow'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'
import { LockedStakingApyPropsType } from './types'
import LockedAprTooltipContent from './Common/LockedAprTooltipContent'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'
import OriginalLockedInfo from '../OriginalLockedInfo'

const HelpIconWrapper = styled.div`
  align-self: center;
`

interface LockedStakingApyProps extends LockedStakingApyPropsType {
  showICake?: boolean
  pool?: Pool.DeserializedPool<Token>
  account?: string
}

const LockedStakingApy: React.FC<React.PropsWithChildren<LockedStakingApyProps>> = ({
  stakingToken,
  stakingTokenBalance,
  userData,
  showICake,
  pool,
  account,
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

  const currentLockedAmountAsBigNumber = useMemo(() => {
    return userData?.balance?.cakeAsBigNumber
  }, [userData?.balance?.cakeAsBigNumber])

  const currentLockedAmount = getBalanceNumber(currentLockedAmountAsBigNumber)

  const usdValueStaked = useBUSDCakeAmount(currentLockedAmount)

  const { weekDuration, lockEndDate, secondDuration, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime,
    lockEndTime: userData?.lockEndTime,
    burnStartTime: userData?.burnStartTime,
  })

  const { lockedApy } = useVaultApy({ duration: secondDuration })

  // earningTokenBalance includes overdue fee if any
  const earningTokenBalance = useMemo(() => {
    return getBalanceNumber(currentLockedAmountAsBigNumber.minus(userData?.cakeAtLastUserAction))
  }, [currentLockedAmountAsBigNumber, userData?.cakeAtLastUserAction])

  const boostedYieldAmount = useMemo(() => {
    return getFullDisplayBalance(userData?.cakeAtLastUserAction, 18, 5)
  }, [userData?.cakeAtLastUserAction])

  const tooltipContent = <LockedAprTooltipContent boostedYieldAmount={boostedYieldAmount} />
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

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

  const originalLockedAmount = getBalanceNumber(userData?.lockedAmount)

  const {
    targetRef: tagTargetRefOfLocked,
    tooltip: tagTooltipOfLocked,
    tooltipVisible: tagTooltipVisibleOfLocked,
  } = useTooltip(<OriginalLockedInfo pool={pool} />, {
    placement: 'bottom',
  })

  const {
    targetRef: tagTargetRefOfRecentProfit,
    tooltip: tagTooltipOfRecentProfit,
    tooltipVisible: tagTooltipVisibleOfRecentProfit,
  } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  return (
    <LightGreyCard>
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
          <Flex>
            <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} bold fontSize="16px">
              {position >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
            </Text>
            {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
            <span ref={tagTargetRefOfBurn}>
              <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
            </span>
          </Flex>
          <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} fontSize="12px">
            {t('On %date%', { date: lockEndDate })}
          </Text>
        </Box>
      </Flex>
      <Box mb="16px">
        <LockedActions
          userShares={userData?.userShares}
          locked={userData?.locked}
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          stakingTokenBalance={stakingTokenBalance}
          lockedAmount={currentLockedAmountAsBigNumber}
        />
      </Box>
      <Divider />
      {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <Flex alignItems="center" justifyContent="space-between">
          {tooltipVisible && tooltip}
          <TooltipText>
            <Text ref={targetRef} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('APR')}
            </Text>
          </TooltipText>
          <BalanceWithLoading color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        </Flex>
      )}
      <LockDurationRow weekDuration={weekDuration} />
      {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <YieldBoostRow secondDuration={secondDuration} />
      )}
      <Flex alignItems="center" justifyContent="space-between">
        {tagTooltipVisibleOfRecentProfit && tagTooltipOfRecentProfit}
        <TooltipText>
          <Text ref={tagTargetRefOfRecentProfit} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Recent CAKE profit')}
          </Text>
        </TooltipText>
        <BalanceWithLoading color="text" bold fontSize="16px" value={earningTokenBalance} decimals={5} />
      </Flex>
      {position === VaultPosition.LockedEnd && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After Burning In')}
          </Text>
          <Text color="failure" bold>
            <BurningCountDown lockEndTime={userData?.lockEndTime} />
          </Text>
        </Flex>
      )}
      {position === VaultPosition.AfterBurning && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After burning')}
          </Text>
          <Text color="failure" bold>
            {isUndefinedOrNull(userData?.currentOverdueFee)
              ? '-'
              : t('%amount% Burned', { amount: getFullDisplayBalance(userData?.currentOverdueFee, 18, 5) })}
          </Text>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Original locked amount')}
        </Text>
        <BalanceWithLoading color="text" bold fontSize="16px" value={originalLockedAmount} decimals={2} />
      </Flex>
      {showICake && <IfoCakeRow />}
    </LightGreyCard>
  )
}

export default memo(LockedStakingApy)
