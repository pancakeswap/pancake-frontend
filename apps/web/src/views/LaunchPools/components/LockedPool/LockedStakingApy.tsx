import { Pool } from '@pancakeswap/widgets-internal'
import { memo } from 'react'

import { Token } from '@pancakeswap/sdk'
import { LightGreyCard } from 'components/Card'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import LockDurationRow from './Common/LockDurationRow'
import LockedStaking from './LockedStaking'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'
import { LockedStakingApyPropsType } from './types'

interface LockedStakingApyProps extends LockedStakingApyPropsType {
  showICake?: boolean
  pool?: Pool.DeserializedPool<Token>
  account?: string
}

const LockedStakingApy: React.FC<React.PropsWithChildren<LockedStakingApyProps>> = ({ userData, pool }) => {
  const isUserDelegated = useIsUserDelegated()
  // const position = useMemo(
  //   () =>
  //     getVaultPosition({
  //       userShares: userData?.userShares,
  //       locked: userData?.locked,
  //       lockEndTime: userData?.lockEndTime,
  //     }),
  //   [userData],
  // )

  const { weekDuration } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime ?? '',
    lockEndTime: userData?.lockEndTime ?? '',
    burnStartTime: userData?.burnStartTime,
  })

  // const { lockedApy } = useVaultApy({ duration: secondDuration })

  // earningTokenBalance includes overdue fee if any
  // const earningTokenBalance = useMemo(() => {
  //   return getBalanceNumber(userData?.balance?.cakeAsBigNumber.minus(userData?.cakeAtLastUserAction))
  // }, [userData?.balance?.cakeAsBigNumber, userData?.cakeAtLastUserAction])

  return (
    <LightGreyCard>
      <LockedStaking pool={pool} userData={userData} />
      {/* {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
        <Flex alignItems="center" justifyContent="space-between">
          {tooltipVisible && tooltip}
          <TooltipText>
            <Text ref={targetRef} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('APR')}
            </Text>
          </TooltipText>
          <BalanceWithLoading color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        </Flex>
      )} */}
      {!isUserDelegated && <LockDurationRow weekDuration={weekDuration} />}
      {/* {![VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(position) && (
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
      {showICake && <IfoCakeRow />} */}
    </LightGreyCard>
  )
}

export default memo(LockedStakingApy)
