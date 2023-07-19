import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { Flex, Text, TooltipText, useTooltip, BalanceWithLoading, Pool } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useVaultApy } from 'hooks/useVaultApy'
import Divider from 'components/Divider'
import { Token } from '@pancakeswap/sdk'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BurningCountDown from './Common/BurningCountDown'
import YieldBoostRow from './Common/YieldBoostRow'
import LockDurationRow from './Common/LockDurationRow'
import IfoCakeRow from './Common/IfoCakeRow'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'
import { LockedStakingApyPropsType } from './types'
import LockedAprTooltipContent from './Common/LockedAprTooltipContent'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'
import LockedStaking from './LockedStaking'

interface LockedStakingApyProps extends LockedStakingApyPropsType {
  showICake?: boolean
  pool?: Pool.DeserializedPool<Token>
  account?: string
}

const LockedStakingApy: React.FC<React.PropsWithChildren<LockedStakingApyProps>> = ({
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

  const { weekDuration, secondDuration } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime,
    lockEndTime: userData?.lockEndTime,
    burnStartTime: userData?.burnStartTime,
  })

  const { lockedApy } = useVaultApy({ duration: secondDuration })

  // earningTokenBalance includes overdue fee if any
  const earningTokenBalance = useMemo(() => {
    return getBalanceNumber(userData?.balance?.cakeAsBigNumber.minus(userData?.cakeAtLastUserAction))
  }, [userData?.balance?.cakeAsBigNumber, userData?.cakeAtLastUserAction])

  const boostedYieldAmount = useMemo(() => {
    return getFullDisplayBalance(userData?.cakeAtLastUserAction, 18, 5)
  }, [userData?.cakeAtLastUserAction])

  const tooltipContent = <LockedAprTooltipContent boostedYieldAmount={boostedYieldAmount} />
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const originalLockedAmount = getBalanceNumber(userData?.lockedAmount)

  const {
    targetRef: tagTargetRefOfRecentProfit,
    tooltip: tagTooltipOfRecentProfit,
    tooltipVisible: tagTooltipVisibleOfRecentProfit,
  } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  return (
    <LightGreyCard>
      <LockedStaking pool={pool} userData={userData} />
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
