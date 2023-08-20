import { Flex, StarCircle, Text } from '@pancakeswap/uikit'

import { FixedStakingCalculator } from './FixedStakingCalculator'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

export function AprFooter({ lockPeriod, stakingToken, boostDayPercent, lockDayPercent, pools }) {
  const { boostAPR, lockAPR } = useFixedStakeAPR({ boostDayPercent, lockDayPercent })

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
        <FixedStakingCalculator stakingToken={stakingToken} initialLockPeriod={lockPeriod} pools={pools} />
      </Flex>
    </Flex>
  )
}
