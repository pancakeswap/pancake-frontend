import { Box, Button, Flex, Text, IconButton, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'

import { differenceInMilliseconds, format } from 'date-fns'

import { LockedFixedTag } from './LockedFixedTag'
import { PoolGroup, StakePositionUserInfo, StakedPosition } from '../type'
import { ClaimModal } from './ClaimModal'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { FixedRestakingModal } from './RestakeFixedStakingModal'
import { UnstakeBeforeEnededModal } from './UnstakeBeforeEndedModal'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'

export function StakedPositionSection({
  token,
  stakePositionUserInfo,
  unlockTime,
  lockPeriod,
  poolIndex,
  lockDayPercent,
  boostDayPercent,
  withdrawalFee,
  pool,
  stakedPeriods,
  stakePosition,
}: {
  unlockTime: number
  boostDayPercent: number
  token: Token
  stakePosition: StakedPosition
  stakePositionUserInfo: StakePositionUserInfo
  lockPeriod: number
  poolIndex: number
  lockDayPercent: number
  withdrawalFee: number
  pool: PoolGroup
  stakedPeriods: number[]
}) {
  const { t } = useTranslation()

  const { boostAPR, lockAPR } = useFixedStakeAPR({ lockDayPercent, boostDayPercent })

  const { accrueInterest, amountDeposit } = useCalculateProjectedReturnAmount({
    token,
    stakePositionUserInfo: stakePosition.userInfo,
    lockPeriod,
    apr: boostAPR.greaterThan(0) ? boostAPR : lockAPR,
  })

  const poolEndDay = pool.pools[poolIndex].endDay

  const shouldUnlock = differenceInMilliseconds(unlockTime * 1_000, new Date()) <= 0

  const stakedPositions = useMemo(() => [stakePosition], [stakePosition])

  return (
    <>
      <Flex mb="8px" justifyContent="space-between" width="100%">
        <Flex>
          <Box>
            <AmountWithUSDSub amount={amountDeposit} />
          </Box>
        </Flex>

        {shouldUnlock ? (
          <UnlockedFixedTag>{lockPeriod}D</UnlockedFixedTag>
        ) : (
          <LockedFixedTag>{lockPeriod}D</LockedFixedTag>
        )}
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <Box>
          <Text color="textSubtle" fontSize="12px">
            APR: {lockAPR.toSignificant(2)}%
          </Text>

          <Text color="textSubtle" fontSize="12px">
            {shouldUnlock ? 'Fixed Staking ended' : `Ends on ${format(unlockTime * 1_000, 'MMM d, yyyy')}`}
          </Text>

          <Text color="textSubtle" fontSize="12px">
            {shouldUnlock ? t('Reward') : t('Est. Reward')}: {accrueInterest.toFixed(4)} {token.symbol}
          </Text>
        </Box>
        {shouldUnlock ? (
          <ClaimModal
            poolEndDay={poolEndDay}
            stakedPeriods={stakedPeriods}
            pool={pool}
            lockAPR={lockAPR}
            boostAPR={boostAPR}
            poolIndex={poolIndex}
            stakePositionUserInfo={stakePositionUserInfo}
            token={token}
            lockPeriod={lockPeriod}
            unlockTime={unlockTime}
          >
            {(openClaimModal) => (
              <Button height="auto" onClick={openClaimModal}>
                {t('Claim')}
              </Button>
            )}
          </ClaimModal>
        ) : (
          <Flex>
            <UnstakeBeforeEnededModal
              pools={pool.pools}
              poolEndDay={poolEndDay}
              token={token}
              lockPeriod={lockPeriod}
              lockAPR={lockAPR}
              boostAPR={boostAPR}
              stakePositionUserInfo={stakePositionUserInfo}
              withdrawalFee={withdrawalFee}
              poolIndex={poolIndex}
            >
              {(openUnstakeModal) => (
                <IconButton variant="secondary" onClick={openUnstakeModal} mr="6px">
                  <MinusIcon color="primary" width="14px" />
                </IconButton>
              )}
            </UnstakeBeforeEnededModal>
            <FixedRestakingModal
              stakedPositions={stakedPositions}
              amountDeposit={amountDeposit}
              stakedPeriods={stakedPeriods}
              stakingToken={token}
              pools={pool.pools}
              initialLockPeriod={lockPeriod}
            >
              {(openModal) => (
                <IconButton variant="secondary" onClick={openModal}>
                  <AddIcon color="primary" width="14px" />
                </IconButton>
              )}
            </FixedRestakingModal>
          </Flex>
        )}
      </Flex>
    </>
  )
}
