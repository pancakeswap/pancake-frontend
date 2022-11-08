import { Flex, Text, TooltipText, useTooltip, Balance, Pool, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { FC, ReactNode } from 'react'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const StatWrapper: FC<React.PropsWithChildren<{ label: ReactNode }>> = ({ children, label }) => {
  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center" width="100%">
      {label}
      <Flex alignItems="center">{children}</Flex>
    </Flex>
  )
}

const TotalToken = ({ total, token }: { total: BigNumber; token: Coin }) => {
  if (total && total.gte(0)) {
    return <Balance small value={getBalanceNumber(total, token.decimals)} decimals={3} unit={` ${token.symbol}`} />
  }
  return <Skeleton width="90px" height="21px" />
}

export const TotalStaked: FC<React.PropsWithChildren<{ totalStaked: BigNumber; stakingToken: Coin }>> = ({
  totalStaked,
  stakingToken,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }),
    {
      placement: 'bottom',
    },
  )

  return (
    <StatWrapper
      label={
        <TooltipText ref={targetRef} small>
          {t('Total staked')}:
        </TooltipText>
      }
    >
      {tooltipVisible && tooltip}
      <TotalToken total={totalStaked} token={stakingToken} />
    </StatWrapper>
  )
}

export const AprInfo: FC<React.PropsWithChildren<{ pool: Pool.DeserializedPool<Coin>; stakedBalance: BigNumber }>> = ({
  pool,
  stakedBalance,
}) => {
  const { t } = useTranslation()
  const { account = '' } = useActiveWeb3React()

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small>{t('APR')}:</Text>
      <Pool.Apr<Coin>
        shouldShowApr
        pool={pool}
        showIcon
        stakedBalance={stakedBalance}
        performanceFee={0}
        fontSize="14px"
        account={account}
        autoCompoundFrequency={0}
      />
    </Flex>
  )
}
