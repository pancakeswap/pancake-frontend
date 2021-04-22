import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

const CardActions: React.FC<{
  pool: Pool
  stakedBalance: BigNumber
  accountHasStakedBalance: boolean
  stakingTokenPrice: number
}> = ({ pool, stakedBalance, accountHasStakedBalance, stakingTokenPrice }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, isFinished, userData, stakingLimit } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isStaked = stakedBalance.toNumber() > 0

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {TranslateString(330, `earned`)}
              </InlineText>
            </Box>
            <HarvestActions earnings={earnings} earningToken={earningToken} sousId={sousId} isBnbPool={isBnbPool} />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : TranslateString(1070, `stake`)}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? TranslateString(1074, `staked`) : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction
            stakingToken={stakingToken}
            earningTokenSymbol={earningToken.symbol}
            isFinished={isFinished}
            sousId={sousId}
          />
        ) : (
          <StakeActions
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenPrice={stakingTokenPrice}
            stakingToken={stakingToken}
            earningToken={earningToken}
            stakedBalance={stakedBalance}
            stakingLimit={stakingLimit}
            sousId={sousId}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
