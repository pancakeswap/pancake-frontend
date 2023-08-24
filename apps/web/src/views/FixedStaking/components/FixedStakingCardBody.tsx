import { Box, ButtonMenu, ButtonMenuItem, Flex, LockIcon, Text, UnlockIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { ReactNode } from 'react'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import { PoolGroup, StakedPosition } from '../type'
import { FixedStakingCardFooter } from './FixedStakingCardFooter'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { AprFooter } from './AprFooter'
import useSelectedPeriod from '../hooks/useSelectedPeriod'
import AprCell from './AprCell'

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

export function FixedStakingCardBody({
  children,
  pool,
  stakedPositions,
}: {
  pool: PoolGroup
  stakedPositions: StakedPosition[]
  children: (selectedPeriodIndex: number | null, setSelectedPeriodIndex: (index: number | null) => void) => ReactNode
}) {
  const { t } = useTranslation()
  const totalStakedAmount = CurrencyAmount.fromRawAmount(pool.token, pool.totalDeposited.toNumber())

  const { selectedPeriodIndex, setSelectedPeriodIndex, claimedIndexes, lockedIndexes, selectedPool } =
    useSelectedPeriod({
      pool,
      stakedPositions,
    })

  return (
    <>
      <OverviewDataRow
        title={t('APR:')}
        detail={<AprCell selectedPeriodIndex={selectedPeriodIndex} selectedPool={selectedPool} pool={pool} />}
      />

      <OverviewDataRow
        title={t('Stake Periods:')}
        detail={
          <ButtonMenu
            activeIndex={selectedPeriodIndex ?? pool.pools.length}
            onItemClick={(index) => {
              if ([...claimedIndexes, ...lockedIndexes].includes(index)) {
                return
              }

              setSelectedPeriodIndex(index)
            }}
            scale="sm"
            variant="subtle"
          >
            {pool.pools.map((p, index) => (
              <ButtonMenuItem width="48px" key={p.lockPeriod}>
                {claimedIndexes.includes(index) ? <UnlockIcon color="secondary" /> : null}
                {lockedIndexes.includes(index) ? <LockIcon color="secondary" /> : null}
                {p.lockPeriod}D
              </ButtonMenuItem>
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
            unlockDayPercent={p.unlockDayPercent}
          />
        ))}
      </FixedStakingCardFooter>
    </>
  )
}
