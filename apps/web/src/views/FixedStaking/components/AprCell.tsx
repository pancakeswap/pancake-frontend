import { Flex, LinkExternal, StarCircle, Text } from '@pancakeswap/uikit'

import { bscTokens } from '@pancakeswap/tokens'
import { FixedStakingPool, PoolGroup } from '../type'
import { AprRange, calculateAPRPercent } from './AprRange'
import { FixedStakingCalculator } from './FixedStakingCalculator'

const WBNBGiftLink = () => {
  return (
    <LinkExternal
      mr="8px"
      data-dd-action-name="wbnb staking campaign"
      style={{ textDecoration: 'none' }}
      showExternalIcon={false}
      href="https://blog.pancakeswap.finance/articles/stake-wbnb-on-pancake-swap-to-win-combo-rewards-5-000-extra-reward-pool?utm_source=homepagebanner&utm_medium=website&utm_campaign=homepage&utm_id=WBNBsimplestakingcampaign"
    >
      🎁
    </LinkExternal>
  )
}

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
      {pool.token.equals(bscTokens.wbnb) ? <WBNBGiftLink /> : null}
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
      {selectedPool.token.equals(bscTokens.wbnb) ? <WBNBGiftLink /> : null}
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
