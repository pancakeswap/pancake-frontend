import { Flex, StarCircle, Text } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/swap-sdk-core'

import { FixedStakingCalculator } from './FixedStakingCalculator'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'
import { FixedStakingPool } from '../type'

export function AprFooter({
  lockPeriod,
  stakingToken,
  boostDayPercent,
  lockDayPercent,
  unlockDayPercent,
  pools,
}: {
  lockPeriod: number
  stakingToken: Token
  boostDayPercent: number
  lockDayPercent: number
  unlockDayPercent: number
  pools: FixedStakingPool[]
}) {
  const { boostAPR, lockAPR } = useFixedStakeAPR({ boostDayPercent, lockDayPercent, unlockDayPercent })

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text>{lockPeriod}D APR:</Text>
      <Flex alignItems="center">
        {boostAPR.greaterThan(0) ? (
          <>
            <StarCircle width="18px" color="success" />
            <Text mx="4px" color="success" bold>
              Up to {boostAPR.toSignificant(2)}%
            </Text>
          </>
        ) : null}
        <Text>{boostAPR.greaterThan(0) ? <s>{lockAPR.toSignificant(2)}%</s> : <>{lockAPR.toSignificant(2)}%</>}</Text>
        <FixedStakingCalculator
          hideBackButton
          stakingToken={stakingToken}
          initialLockPeriod={lockPeriod}
          pools={pools}
        />
      </Flex>
    </Flex>
  )
}
