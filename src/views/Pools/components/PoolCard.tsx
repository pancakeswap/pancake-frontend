import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApy } from 'utils/apy'

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
    image,
    tokenName,
    tokenAddress,
    stakingTokenName,
    stakingTokenDecimals,
    projectLink,
    harvest,
    tokenDecimals,
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
  const rewardTokenPrice = useGetApiPrice(tokenName)
  const stakingTokenPrice = useGetApiPrice(stakingTokenName)
  const apy = getPoolApy(
    stakingTokenPrice,
    rewardTokenPrice,
    getBalanceNumber(pool.totalStaked, stakingTokenDecimals),
    parseFloat(pool.tokenPerBlock),
  )

  const [pendingTx, setPendingTx] = useState(false)

  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const isCardActive = isFinished && accountHasStakedBalance

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <CardHeader
        title={`${TranslateString(318, 'Earn')} ${tokenName}`}
        coinIconUrl={`/images/tokens/${image || tokenName}.png`}
        tokenName={tokenName}
      />
      <Flex flexDirection="column" padding="24px">
        <Apr tokenName={tokenName} isOldSyrup={isOldSyrup} isFinished={isFinished} apy={apy} />
        <Earned
          isFinished={isFinished}
          sousId={sousId}
          tokenName={tokenName}
          isBnbPool={isBnbPool}
          harvest={harvest}
          isOldSyrup={isOldSyrup}
          earnings={earnings}
          pendingTx={pendingTx}
          tokenDecimals={tokenDecimals}
          setPendingTx={setPendingTx}
        />
        <Stake tokenName={tokenName} pool={pool} isOldSyrup={isOldSyrup} isBnbPool={isBnbPool} />
      </Flex>
      {/* <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Image src={`/images/tokens/${image || tokenName}.png`} width={64} height={64} alt={tokenName} />
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
      </div> */}
      {/* <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />
      <StyledCardActions>
        {!account && <UnlockButton />}
        {account &&
          (needsApproval && !isOldSyrup ? (
            <div style={{ flex: 1 }}>
              <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
                {`Approve ${stakingTokenName}`}
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
                        await onUnstake('0', stakingTokenDecimals)
                        setPendingTx(false)
                      }
                    : onPresentWithdraw
                }
              >
                {`Unstake ${stakingTokenName}`}
              </Button>
              <StyledActionSpacer />
              {!isOldSyrup && (
                <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                  <AddIcon color="background" width="14px" />
                </IconButton>
              )}
            </>
          ))}
      </StyledCardActions> */}
      {/* <StyledDetails>
        <div>{TranslateString(384, 'Your Stake')}:</div>
        <Balance
          fontSize="14px"
          isDisabled={isFinished}
          value={getBalanceNumber(stakedBalance, stakingTokenDecimals)}
        />
      </StyledDetails> */}
      <CardFooter
        projectLink={projectLink}
        decimals={stakingTokenDecimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        poolCategory={poolCategory}
        tokenName={tokenName}
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
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
