import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApy } from 'utils/apy'
import { getAddress } from 'utils/addressHelpers'

import { QuoteToken, PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { useGetApiPrice } from 'state/hooks'
import Card from './Card'
import CardFooter from './CardFooter'
import CardHeader from './CardHeader'
import Apr from './Apr'
import Earned from './Earned'
import Stake from './Stake'

interface HarvestProps {
  pool: Pool
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    harvest,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()

  // APY
  const rewardTokenPrice = useGetApiPrice(earningToken.symbol)
  const stakingTokenPrice = useGetApiPrice(stakingToken.symbol)
  const apy = getPoolApy(
    stakingTokenPrice,
    rewardTokenPrice,
    getBalanceNumber(pool.totalStaked, stakingToken.decimals),
    parseFloat(pool.tokenPerBlock),
  )

  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const isOldSyrup = stakingToken.symbol === QuoteToken.SYRUP
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const isCardActive = isFinished && accountHasStakedBalance
  const tokenName = earningToken.symbol
  const tokenDecimals = earningToken.decimals
  const poolImage = `${pool.earningToken.symbol}-${pool.stakingToken.symbol}.svg`.toLocaleLowerCase()

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <CardHeader
        title={`${TranslateString(318, 'Earn')} ${tokenName}`}
        coinIconUrl={`/images/pools/${poolImage}`}
        tokenName={tokenName}
      />
      <Flex flexDirection="column" padding="24px">
        <Apr tokenName={tokenName} isOldSyrup={isOldSyrup} isFinished={isFinished} apy={apy} />
        <Earned
          isFinished={isFinished}
          sousId={sousId}
          tokenName={tokenName}
          stakingTokenName={stakingToken.symbol}
          isBnbPool={isBnbPool}
          harvest={harvest}
          isOldSyrup={isOldSyrup}
          earnings={earnings}
          tokenDecimals={tokenDecimals}
          stakingTokenDecimals={stakingToken.decimals}
        />
        <Stake pool={pool} isOldSyrup={isOldSyrup} isBnbPool={isBnbPool} />
      </Flex>
      <CardFooter
        projectLink={earningToken.projectLink}
        decimals={stakingToken.decimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        poolCategory={poolCategory}
        tokenName={earningToken.symbol}
        tokenAddress={getAddress(earningToken.address)}
        tokenDecimals={earningToken.decimals}
      />
    </Card>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`

export default PoolCard
