import { Balance, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { ReactNode } from 'react'
import { Percent } from '@pancakeswap/swap-sdk-core'

import { PoolGroup } from '../type'
import { FixedStakingCardFooter } from './FixedStakingCardFooter'

function OverviewDataRow({ title, detail }) {
  return (
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Text fontSize={['14px', '14px', '16px']} textAlign="left">
        {title}
      </Text>
      {detail}
    </Flex>
  )
}

const PERCENT_DIGIT = 1000000000
const DAYS_A_YEAR = 365

export function FixedStakingCardBody({ children, pool }: { pool: PoolGroup; children: ReactNode }) {
  const { t } = useTranslation()
  const totalStakedAmount = getBalanceAmount(pool.totalDeposited, pool.token.decimals)

  const formattedUsdValueStaked = useStablecoinPriceAmount(pool.token, totalStakedAmount.toNumber())
  const minAPR = new Percent(pool.minLockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR)
  const maxAPR = new Percent(pool.maxLockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR)

  return (
    <>
      <OverviewDataRow
        title={t('APR:')}
        detail={
          <Text bold>
            {minAPR.toSignificant(2)}% ~ {maxAPR.toSignificant(2)}%
          </Text>
        }
      />

      <OverviewDataRow
        title={t('Lock Periods:')}
        detail={
          <ButtonMenu activeIndex={4} scale="sm" variant="subtle">
            {pool.pools.map((p) => (
              <ButtonMenuItem>{p.lockPeriod}D</ButtonMenuItem>
            ))}
          </ButtonMenu>
        }
      />

      <OverviewDataRow
        title={t('Total Staked:')}
        detail={
          <Balance
            fontSize={['14px', '14px', '16px']}
            value={formattedUsdValueStaked}
            decimals={2}
            prefix="$"
            fontWeight={[600, 400]}
          />
        }
      />

      <Flex flexDirection="column" width="100%" mb="8px">
        {children}
      </Flex>

      <FixedStakingCardFooter>
        {pool.pools.map((p) => (
          <Flex justifyContent="space-between">
            <Text>{p.lockPeriod}D APR</Text>
            <Flex>
              <Text mr="4px" color="success" bold>
                Up to {new Percent(p.lockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR).toSignificant(2)}%
              </Text>
              <Text>
                <s>{new Percent(p.lockDayPercent, PERCENT_DIGIT).multiply(DAYS_A_YEAR).toSignificant(2)}%</s>
              </Text>
            </Flex>
          </Flex>
        ))}
      </FixedStakingCardFooter>
    </>
  )
}
