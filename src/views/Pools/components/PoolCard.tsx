import BigNumber from 'bignumber.js'
import React from 'react'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import { getAddress } from 'utils/addressHelpers'
import { PoolCategory } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { Pool } from 'state/types'

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
    apr = null,
  } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()

  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const isOldSyrup = stakingToken.symbol === tokens.syrup.symbol
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const isCardActive = accountHasStakedBalance
  const tokenDecimals = earningToken.decimals
  const tokenName = earningToken.symbol
  const poolImage = `${pool.earningToken.symbol}-${pool.stakingToken.symbol}.svg`.toLocaleLowerCase()

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      <CardHeader
        title={`${TranslateString(318, 'Earn')} ${tokenName}`}
        coinIconUrl={`/images/pools/${poolImage}`}
        tokenName={tokenName}
        stakingTokenName={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <Flex flexDirection="column" padding="24px">
        <Apr tokenName={tokenName} isOldSyrup={isOldSyrup} isFinished={isFinished} apy={apr} />
        <Earned
          isFinished={isFinished}
          sousId={sousId}
          earningTokenName={earningToken.symbol}
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
        tokenName={stakingToken.symbol}
        tokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
        tokenDecimals={tokenDecimals}
      />
    </Card>
  )
}

export default PoolCard
