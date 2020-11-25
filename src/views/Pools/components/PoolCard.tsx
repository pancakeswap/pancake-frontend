import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, useModal, AddIcon } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { BLOCKS_PER_YEAR } from 'config'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useSousAllowance } from 'hooks/useAllowance'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousEarnings, useSousLeftBlocks } from 'hooks/useEarnings'
import { useSousStake } from 'hooks/useStake'
import useSushi from 'hooks/useSushi'
import { useSousStakedBalance, useSousTotalStaked } from 'hooks/useStakedBalance'
import useTokenBalance, { useTokenBalance2 } from 'hooks/useTokenBalance'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSousReward } from 'hooks/useReward'
import { getSyrupAddress } from 'sushi/utils'
import Balance from 'components/Balance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CardTitle from './CardTitle'
import CardTokenImg from './CardTokenImg'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'

interface HarvestProps {
  tokenName: string
  sousId: number
  projectLink: string
  harvest: boolean
  tokenPerBlock: string
  cakePrice: BigNumber
  tokenPrice: BigNumber
  isCommunity?: boolean
  isFinished?: boolean
  isOldSyrup?: boolean
}

const CAKE_ADDRESS = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
const COMMUNITY_ADDR = {
  STAX: {
    lp: '0x7cd05f8b960ba071fdf69c750c0e5a57c8366500',
    token: '0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4',
  },
  NAR: {
    lp: '0x745c4fd226e169d6da959283275a8e0ecdd7f312',
    token: '0xa1303e6199b319a891b79685f0537d289af1fc83',
  },
  NYA: {
    lp: '0x2730bf486d658838464a4ef077880998d944252d',
    token: '0xbfa0841f7a90c4ce6643f651756ee340991f99d5',
  },
  bROOBEE: {
    lp: '0x970858016C963b780E06f7DCfdEf8e809919BcE8',
    token: '0xe64f5cb844946c1f102bd25bbd87a5ab4ae89fbe',
  },
}

const PoolCard: React.FC<HarvestProps> = ({
  sousId,
  tokenName,
  projectLink,
  harvest,
  cakePrice,
  tokenPrice,
  tokenPerBlock,
  isCommunity,
  isFinished,
  isOldSyrup,
}) => {
  const TranslateString = useI18n()
  const { ethereum } = useWallet()
  const syrup = useMemo(() => {
    return getContract(ethereum as provider, '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
  }, [ethereum])
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
  const { onReward } = useSousReward(sousId)

  const [pendingTx, setPendingTx] = useState(false)

  // /!\ Dirty fix
  // The community LP are all against CAKE instead of BNB. Thus, the usual function for price computation didn't work.
  // This quick fix aim to properly compute the price of CAKE pools in order to get the correct APY.
  // This fix will need to be cleaned, by using config files instead of the COMMUNITY_ADDR,
  // and factorise the price computation logic.
  const cakeBalanceOnLP = useTokenBalance2(CAKE_ADDRESS, COMMUNITY_ADDR[tokenName]?.lp)
  const tokenBalanceOnLP = useTokenBalance2(COMMUNITY_ADDR[tokenName]?.token, COMMUNITY_ADDR[tokenName]?.lp)
  const price = (() => {
    if (isCommunity) {
      if (cakeBalanceOnLP === 0 || tokenBalanceOnLP === 0) return new BigNumber(0)
      const tokenBalanceOnLPNB = new BigNumber(tokenBalanceOnLP)
      const cakeBalanceOnLPBN = new BigNumber(cakeBalanceOnLP)
      const ratio = cakeBalanceOnLPBN.div(tokenBalanceOnLPNB)
      return ratio.times(cakePrice)
    }
    return tokenPrice
  })()

  const apy: BigNumber = useMemo(() => {
    if (!harvest || cakePrice.isLessThanOrEqualTo(0)) return null

    const a = price.times(BLOCKS_PER_YEAR).times(tokenPerBlock)
    const b = cakePrice.times(getBalanceNumber(totalStaked))

    return a.div(b).times(100)
  }, [cakePrice, harvest, tokenPerBlock, price, totalStaked])

  const accountHasStakedBalance = account && stakedBalance.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber()

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
              tokenName === 'CTK' || tokenName === 'HARD' || tokenName === 'BLK'
                ? getBalanceNumber(earnings, 6)
                : getBalanceNumber(earnings)
            }
            isDisabled={isReallyFinished}
          />
        ) : (
          <OldSyrupTitle hasBalance={accountHasStakedBalance} />
        )}
        <Label isFinished={isReallyFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />
        <StyledCardActions>
          {!account && <UnlockButton />}
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
                    <AddIcon color="background" />
                  </Button>
                )}
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <div style={{ flex: 1 }}>{TranslateString(352, 'APY')}:</div>
          {isReallyFinished || isOldSyrup ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isReallyFinished} value={apy?.toNumber()} unit="%" />
          )}
        </StyledDetails>
        <StyledDetails>
          <div style={{ flex: 1 }}>
            <span role="img" aria-label="syrup">
              🥞{' '}
            </span>
            {TranslateString(384, 'Your Stake')}:
          </div>
          <Balance fontSize="14px" isDisabled={isReallyFinished} value={getBalanceNumber(stakedBalance)} />
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
