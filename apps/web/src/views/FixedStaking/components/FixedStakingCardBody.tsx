import { Box, ButtonMenu, ButtonMenuItem, Flex, StarCircle, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { ReactNode, useState } from 'react'
import { CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'

import { PoolGroup } from '../type'
import { FixedStakingCardFooter } from './FixedStakingCardFooter'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'
import { DAYS_A_YEAR, PERCENT_DIGIT } from '../constant'
import { AmountWithUSDSub } from './AmountWithUSDSub'

function OverviewDataRow({ title, detail, alignItems = 'center' }) {
  return (
    <Flex alignItems={alignItems} justifyContent="space-between" mb="8px">
      <Text fontSize={['14px', '14px', '16px']} textAlign="left">
        {title}
      </Text>
      {detail}
    </Flex>
  )
}

function AprFooter({ lockPeriod, stakingToken, boostDayPercent, lockDayPercent, pools }) {
  const { boostAPR, lockAPR } = useFixedStakeAPR({ boostDayPercent, lockDayPercent })

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text>{lockPeriod}D APR</Text>
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

export function FixedStakingCardBody({
  children,
  pool,
}: {
  pool: PoolGroup
  children: (selectedPeriodIndex: number | null, setSelectedPeriodIndex: (index: number | null) => void) => ReactNode
}) {
  const { t } = useTranslation()
  const totalStakedAmount = CurrencyAmount.fromRawAmount(pool.token, pool.totalDeposited.toNumber())
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(null)

  const minAPR = new Percent(pool.minLockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR)
  const maxAPR = new Percent(pool.maxLockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR)

  return (
    <>
      <OverviewDataRow
        title={t('APR:')}
        detail={
          <Flex alignItems="center">
            <Text bold>
              {minAPR.toSignificant(2)}% ~ {maxAPR.toSignificant(2)}%
            </Text>
            <FixedStakingCalculator
              stakingToken={pool.token}
              pools={pool.pools}
              key={selectedPeriodIndex}
              initialLockPeriod={pool?.pools[selectedPeriodIndex]?.lockPeriod}
            />
          </Flex>
        }
      />

      <OverviewDataRow
        title={t('Stake Periods:')}
        detail={
          <ButtonMenu
            activeIndex={selectedPeriodIndex ?? pool.pools.length}
            onItemClick={(index) => setSelectedPeriodIndex(index)}
            scale="sm"
            variant="subtle"
          >
            {pool.pools.map((p) => (
              <ButtonMenuItem key={p.lockPeriod}>{p.lockPeriod}D</ButtonMenuItem>
            ))}
          </ButtonMenu>
        }
      />

      <OverviewDataRow
        alignItems="baseline"
        title={t('Total Staked:')}
        detail={
          <Box style={{ textAlign: 'end' }}>
            <AmountWithUSDSub amount={totalStakedAmount} />
          </Box>
        }
      />

      <Flex flexDirection="column" width="100%" mb="8px">
        {children(selectedPeriodIndex, setSelectedPeriodIndex)}
      </Flex>

      <FixedStakingCardFooter>
        {pool.pools.map((p) => (
          <AprFooter
            key={p.lockPeriod}
            stakingToken={pool.token}
            lockPeriod={p.lockPeriod}
            pools={pool.pools}
            boostDayPercent={p.boostDayPercent}
            lockDayPercent={p.lockDayPercent}
          />
        ))}
      </FixedStakingCardFooter>
    </>
  )
}
