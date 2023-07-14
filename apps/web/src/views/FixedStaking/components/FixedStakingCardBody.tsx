import { Balance, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { ReactNode } from 'react'
import toNumber from 'lodash/toNumber'

import { LockedFixedTag } from './LockedFixedTag'
import { FixedStakingPool } from '../type'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

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

export function FixedStakingCardBody({ children, pool }: { pool: FixedStakingPool; children: ReactNode }) {
  const { t } = useTranslation()
  const totalStakedAmount = getBalanceAmount(pool.totalDeposited, pool.token.decimals)

  const formattedUsdValueStaked = useStablecoinPriceAmount(pool.token, totalStakedAmount.toNumber())
  const { boostAPR, lockAPR } = useFixedStakeAPR(pool)

  return (
    <>
      <OverviewDataRow
        title={t('APR:')}
        detail={
          <Text>
            {lockAPR.toSignificant(2)}% ~ {boostAPR.toSignificant(2)}%
          </Text>
        }
      />

      <OverviewDataRow title={t('Lock Periods:')} detail={<LockedFixedTag>{pool.lockPeriod}D</LockedFixedTag>} />

      <OverviewDataRow
        title={t('Total Staked:')}
        detail={
          <Balance
            fontSize={['14px', '14px', '16px']}
            value={formattedUsdValueStaked}
            decimals={2}
            unit="$"
            fontWeight={[600, 400]}
          />
        }
      />

      <Flex flexDirection="column" width="100%" mb="24px">
        {children}
      </Flex>
    </>
  )
}
