import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Flex, Text, Box } from '@pancakeswap-libs/uikit'
import Label from 'components/Label'
import useI18n from 'hooks/useI18n'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSousHarvest } from 'hooks/useHarvest'
import { useSousStake } from 'hooks/useStake'
import Balance from 'components/Balance'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import WithdrawModal from '../WithdrawModal'
import CompoundModal from '../CompoundModal'
import HarvestButton from '../HarvestButton'
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

  const [pendingTx, setPendingTx] = useState(false)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { onStake } = useSousStake(sousId, isBnbPool)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isStaked = stakedBalance.toNumber() > 0

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingToken.symbol} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

  return (
    <Flex flexDirection="column">
      {/* {harvest && (
        <HarvestButton
          disabled={!earnings.toNumber() || pendingTx}
          text={pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Harvest')}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        />
      )} */}

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
