import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { BLOCKS_PER_YEAR } from 'sushi/lib/constants'
import { AddIcon } from 'components/icons'
import Label from 'components/Label'
import { useSousAllowance } from 'hooks/useAllowance'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousEarnings, useSousLeftBlocks } from 'hooks/useEarnings'
import useModal from 'hooks/useModal'
import { useSousStake } from 'hooks/useStake'
import useSushi from 'hooks/useSushi'
import { useSousStakedBalance, useSousTotalStaked } from 'hooks/useStakedBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSousReward } from 'hooks/useReward'
import { getSyrupAddress } from 'sushi/utils'
import WalletProviderModal from 'components/WalletProviderModal'
import Balance from './Balance'
import SmallValue from './Value'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CardTitle from './CardTitle'
import CardTokenImg from './CardTokenImg'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'

interface HarvestProps {
  syrup: Contract
  tokenName: string
  sousId: number
  projectLink: string
  harvest: boolean
  tokenPerBlock: string
  cakePrice: BigNumber
  tokenPrice: BigNumber
  isCommunity?: boolean
  isFinished?: boolean
}

/**
 * Temporary code
 *
 * 1. Mark this pool as finished
 * 2. Do not let people stake
 * 3. Let people unstake
 *
 * TODO - when all CAKE is unstaked we can remove this
 */
const SYRUPIDS = [5, 6, 3, 1]

const PoolCard: React.FC<HarvestProps> = ({
  syrup,
  sousId,
  tokenName,
  projectLink,
  harvest,
  cakePrice,
  tokenPrice,
  tokenPerBlock,
  isCommunity,
  isFinished,
}) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const allowance = useSousAllowance(syrup, sousId)
  const { onApprove } = useSousApprove(syrup, sousId)
  const { isFinished: isCalculatedFinished, farmStart, blocksRemaining } = useSousLeftBlocks(sousId)
  const tokenBalance = useTokenBalance(syrup.options.address)
  const stakedBalance = useSousStakedBalance(sousId)
  const totalStaked = useSousTotalStaked(sousId)
  const earnings = useSousEarnings(sousId)
  const sushi = useSushi()
  const syrupBalance = useTokenBalance(getSyrupAddress(sushi))

  const { onStake } = useSousStake(sousId)
  const { onUnstake } = useSousUnstake(sousId)

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousReward(sousId)

  const apy = useMemo(() => {
    if (!harvest || cakePrice.isLessThanOrEqualTo(0)) return '-'

    const a = tokenPrice.times(BLOCKS_PER_YEAR).times(tokenPerBlock)
    const b = cakePrice.times(getBalanceNumber(totalStaked))

    return `${a.div(b).times(100).toFixed(2)}%`
  }, [cakePrice, harvest, tokenPerBlock, tokenPrice, totalStaked])

  const accountHasStakedBalance = account && stakedBalance.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber()

  // TODO - Remove this when pool removed
  const isOldSyrup = SYRUPIDS.includes(sousId)

  // 1. isFinished - set manually in the list of pools
  // 2. isCalculatedFinished - calculated based on current/ending block
  // 3. isOldSyrup - Hot fix for corrupted pools
  const isReallyFinished = isFinished || isCalculatedFinished || isOldSyrup
  const isCardActive = isReallyFinished && accountHasStakedBalance

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={isOldSyrup ? 'SYRUP' : 'CAKE'} />,
  )

  // eslint-disable-next-line no-nested-ternary
  const max = sousId === 0 ? (stakedBalance.gt(syrupBalance) ? syrupBalance : stakedBalance) : stakedBalance

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={max} onConfirm={onUnstake} tokenName={isOldSyrup ? 'SYRUP' : 'CAKE'} />,
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

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />, 'provider')
  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <Card isActive={isCardActive} isFinished={isReallyFinished && sousId !== 0}>
      {isReallyFinished && sousId !== 0 && <PoolFinishedSash />}
      <div style={{ padding: '24px' }}>
        <CardTitle isFinished={isReallyFinished && sousId !== 0}>
          {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
        </CardTitle>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <CardTokenImg src={`/images/tokens/${tokenName}.png`} alt={tokenName} />
          </div>
          {account && harvest && !isOldSyrup && (
            <HarvestButton
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? 'Collecting' : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          )}
        </div>
        {/* Dirty fix. @TODO this need to be move to the config file */}
        {!isOldSyrup ? (
          <Balance
            value={
              tokenName === 'CTK' || tokenName === 'HARD' ? getBalanceNumber(earnings, 6) : getBalanceNumber(earnings)
            }
            isFinished={isReallyFinished}
          />
        ) : (
          <OldSyrupTitle hasBalance={accountHasStakedBalance} />
        )}
        <Label isFinished={isReallyFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />
        <StyledCardActions>
          {!account && (
            <div style={{ flex: 1 }}>
              <Button onClick={handleUnlockClick}>{TranslateString(292, 'Unlock Wallet')}</Button>
            </div>
          )}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isReallyFinished || requestedApproval} onClick={handleApprove}>
                  {isOldSyrup ? 'Approve SYRUP' : 'Approve CAKE'}
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
                          await onUnstake('0')
                          setPendingTx(false)
                        }
                      : onPresentWithdraw
                  }
                >
                  {isOldSyrup ? 'Unstake SYRUP' : 'Unstake CAKE'}
                </Button>
                <StyledActionSpacer />
                {!isOldSyrup && (
                  <Button disabled={isReallyFinished && sousId !== 0} onClick={onPresentDeposit}>
                    <AddIcon />
                  </Button>
                )}
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <div style={{ flex: 1 }}>{TranslateString(352, 'APY')}:</div>
          {isReallyFinished || isOldSyrup ? '-' : <SmallValue isFinished={isReallyFinished} value={apy} />}
        </StyledDetails>
        <StyledDetails>
          <div style={{ flex: 1 }}>
            <span role="img" aria-label="syrup">
              🍯{' '}
            </span>
            {TranslateString(999, 'Your Stake')}:
          </div>
          <SmallValue isFinished={isReallyFinished} value={getBalanceNumber(stakedBalance)} />
        </StyledDetails>
      </div>
      <CardFooter
        projectLink={projectLink}
        totalStaked={totalStaked}
        blocksRemaining={blocksRemaining}
        isFinished={isReallyFinished}
        farmStart={farmStart}
        isCommunity={isCommunity}
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

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 14px;
`

export default PoolCard
