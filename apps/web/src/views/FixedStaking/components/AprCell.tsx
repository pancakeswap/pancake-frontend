import { Flex, StarCircle, Text } from '@pancakeswap/uikit'

import { FixedStakingCalculator } from './FixedStakingCalculator'
import { AprRange, calculateAPRPercent } from './AprRange'
import { FixedStakingPool, PoolGroup } from '../type'

export default function AprCell({
  selectedPeriodIndex,
  selectedPool,
  pool,
  hideCalculator,
}: {
  selectedPeriodIndex: number
  selectedPool: FixedStakingPool
  pool: PoolGroup
  hideCalculator?: boolean
}) {
  return selectedPeriodIndex === null || !selectedPool ? (
    <Flex alignItems="center">
      <Text bold>
        <AprRange minLockDayPercent={pool.minLockDayPercent} maxLockDayPercent={pool.maxLockDayPercent} />
      </Text>
      {hideCalculator ? null : (
        <FixedStakingCalculator
          hideBackButton
          stakingToken={pool.token}
          pools={pool.pools}
          key={selectedPeriodIndex}
          initialLockPeriod={pool?.pools[selectedPeriodIndex]?.lockPeriod}
        />
      )}
    </Flex>
  ) : (
    <Flex alignItems="center">
      {calculateAPRPercent(selectedPool.boostDayPercent).greaterThan(0) ? (
        <>
          <StarCircle width="18px" color="success" />
          <Text mx="4px" color="success" bold>
            Up to {calculateAPRPercent(selectedPool.boostDayPercent).toSignificant(2)}%
          </Text>
        </>
      ) : null}
      <Text>
        {calculateAPRPercent(selectedPool.boostDayPercent).greaterThan(0) ? (
          <s>{calculateAPRPercent(selectedPool.lockDayPercent).toSignificant(2)}%</s>
        ) : (
          <>{calculateAPRPercent(selectedPool.lockDayPercent).toSignificant(2)}%</>
        )}
      </Text>
      {hideCalculator ? null : (
        <FixedStakingCalculator
          hideBackButton
          stakingToken={selectedPool.token}
          initialLockPeriod={selectedPool.lockPeriod}
          pools={pool.pools}
        />
      )}
    </Flex>
  )
}
