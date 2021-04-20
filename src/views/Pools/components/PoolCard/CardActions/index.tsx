import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Flex, Text, Box } from '@pancakeswap-libs/uikit'
import Label from 'components/Label'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'

import { useSousHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import CompoundModal from '../CompoundModal'
import HarvestButton from '../HarvestButton'
import StakingActions from './StakingActions'

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

const InlineText = styled(Text)`
  display: inline;
`

const CardActions: React.FC<{
  pool: Pool
  isOldSyrup: boolean
  stakedBalance: BigNumber
  accountHasStakedBalance: boolean
}> = ({ pool, isOldSyrup, stakedBalance, accountHasStakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, isFinished, userData, stakingLimit } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const TranslateString = useI18n()

  const [pendingTx, setPendingTx] = useState(false)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingToken.symbol} (${stakingLimit} max)` : stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

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
      <Box display="inline">
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {`${earningToken.symbol} `}
        </InlineText>
        <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {TranslateString(1072, `earned`)}
        </InlineText>
      </Box>
      {!isOldSyrup ? (
        // IS OLD SYRUP CONDITIONAL
        <BalanceAndCompound>
          <Balance value={getBalanceNumber(earnings, earningToken.decimals)} isDisabled={isFinished} />
          {sousId === 0 && harvest && (
            <HarvestButton
              disabled={!earnings.toNumber() || pendingTx}
              text={TranslateString(704, 'Compound')}
              onClick={onPresentCompound}
            />
          )}
        </BalanceAndCompound>
      ) : (
        <span>Is old syrup</span>
        // <OldSyrupTitle hasBalance={accountHasStakedBalance} />
      )}
      {harvest && !isOldSyrup && (
        // IS OLD SYRUP CONDITIONAL
        <HarvestButton
          disabled={!earnings.toNumber() || pendingTx}
          text={pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Harvest')}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        />
      )}

      <StakingActions
        stakingToken={stakingToken}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        isFinished={isFinished}
        sousId={sousId}
      />

      {/* <Flex flexDirection="column">
        {needsApproval && !isOldSyrup ? (
          // IS OLD SYRUP CONDITIONAL
          <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
            {TranslateString(999, 'Enable')}
          </Button>
        ) : (
          <>
            <Button
              disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
              onClick={
                isOldSyrup
                  ? // IS OLD SYRUP CONDITIONAL
                    async () => {
                      setPendingTx(true)
                      await onUnstake('0', stakingToken.decimals)
                      setPendingTx(false)
                    }
                  : onPresentWithdraw
              }
            >
              {`Unstake ${stakingToken.symbol}`}
            </Button>
            <StyledActionSpacer />
            {!isOldSyrup && (
              // IS OLD SYRUP CONDITIONAL
              <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                <AddIcon color="white" />
              </IconButton>
            )}
          </>
        )}
      </Flex>
      <StyledDetails>
        <div>{TranslateString(384, 'Your Stake')}:</div>
        <Balance
          fontSize="14px"
          isDisabled={isFinished}
          value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
        />
      </StyledDetails> */}
    </Flex>
  )
}

export default CardActions
