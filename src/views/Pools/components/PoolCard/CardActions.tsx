import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon } from '@pancakeswap-libs/uikit'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { useSousHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import HarvestButton from './HarvestButton'

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

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

const CardActions: React.FC<{ pool: Pool; isOldSyrup: boolean }> = ({ pool, isOldSyrup }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, isFinished, userData, stakingLimit } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
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

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])
  return (
    <div>
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        {harvest && !isOldSyrup && (
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
      </div>
      {!isOldSyrup ? (
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
      <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${earningToken.symbol} earned`)} />
      <StyledCardActions>
        {needsApproval && !isOldSyrup ? (
          <div style={{ flex: 1 }}>
            <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
              {`Approve ${stakingToken.symbol}`}
            </Button>
          </div>
        ) : (
          <>
            <Button
              disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
              onClick={
                isOldSyrup
                  ? async () => {
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
              <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                <AddIcon color="white" />
              </IconButton>
            )}
          </>
        )}
      </StyledCardActions>
      <StyledDetails>
        <div>{TranslateString(384, 'Your Stake')}:</div>
        <Balance
          fontSize="14px"
          isDisabled={isFinished}
          value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
        />
      </StyledDetails>
    </div>
  )
}

export default CardActions
