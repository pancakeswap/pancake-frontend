import { Flex, StarCircle, Text } from '@pancakeswap/uikit'
import { FixedStakingPool, PoolGroup } from '../type'
import { AprRange, calculateAPRPercent } from './AprRange'
import { FixedStakingCalculator } from './FixedStakingCalculator'

export default function AprCell({
  selectedPeriodIndex,
  selectedPool,
  pool,
  hideCalculator,
}: {
  selectedPeriodIndex: number | null
  selectedPool?: FixedStakingPool
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
          initialLockPeriod={selectedPool?.lockPeriod}
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
