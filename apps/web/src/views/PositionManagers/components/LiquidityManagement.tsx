import { useTranslation } from '@pancakeswap/localization'
import { BaseAssets, MANAGER } from '@pancakeswap/position-managers'
import { Currency, CurrencyAmount, Percent, Price } from '@pancakeswap/sdk'

import { AtomBox, Button, Flex, RowBetween } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { memo, useCallback, useMemo, useState } from 'react'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Address } from 'viem'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { styled, useTheme } from 'styled-components'
import { StatusView } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusView'
import { useBoostStatusPM } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBoostStatus'
import { useAccount } from 'wagmi'
import { AprDataInfo } from '../hooks'
import { AddLiquidity } from './AddLiquidity'
import { RemoveLiquidity } from './RemoveLiquidity'
import { RewardAssets } from './RewardAssets'
import { StakedAssets } from './StakedAssets'

export const ActionContainer = styled(Flex)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
`
export const Title = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-feature-settings: 'liga' off;
  font-family: Kanit;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 14.4px */
  letter-spacing: 0.36px;
  text-transform: uppercase;
`

interface Props {
  id: string | number
  manager: {
    id: MANAGER
    name: string
  }
  currencyA: Currency
  currencyB: Currency
  earningToken: Currency
  staked0Amount?: CurrencyAmount<Currency>
  staked1Amount?: CurrencyAmount<Currency>
  vaultName: string
  feeTier: FeeAmount
  price?: Price<Currency, Currency>
  ratio: number
  isSingleDepositToken: boolean
  allowDepositToken0: boolean
  allowDepositToken1: boolean
  contractAddress: Address
  token0PriceUSD?: number
  token1PriceUSD?: number
  pendingReward: bigint | undefined
  userVaultPercentage?: Percent
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  rewardPerSecond: string
  aprDataInfo: {
    info: AprDataInfo | undefined
    isLoading: boolean
  }
  rewardEndTime: number
  rewardStartTime: number
  totalAssetsInUsd: number
  totalStakedInUsd: number
  refetch?: () => void
  // TODO: replace with needed returned information
  onAddLiquidity?: (amounts: CurrencyAmount<Currency>[]) => Promise<void>
  // TODO: replace with needed returned information
  onRemoveLiquidity?: (params: { assets: BaseAssets; percentage: Percent }) => Promise<void>
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
  isInCakeRewardDateRange: boolean
  strategyInfoUrl?: string
  learnMoreAboutUrl?: string
  lpTokenDecimals?: number
  aprTimeWindow?: number
  bCakeWrapper?: Address
  minDepositUSD?: number
  boosterMultiplier?: number
}

export const LiquidityManagement = memo(function LiquidityManagement({
  id,
  manager,
  currencyA,
  currencyB,
  earningToken,
  vaultName,
  feeTier,
  price,
  ratio,
  isSingleDepositToken,
  allowDepositToken0,
  allowDepositToken1,
  contractAddress,
  staked0Amount,
  staked1Amount,
  token0PriceUSD,
  token1PriceUSD,
  pendingReward,
  userVaultPercentage,
  poolToken0Amount,
  poolToken1Amount,
  rewardPerSecond,
  aprDataInfo,
  rewardEndTime,
  rewardStartTime,
  refetch,
  totalAssetsInUsd,
  userLpAmounts,
  totalSupplyAmounts,
  precision,
  isInCakeRewardDateRange,
  totalStakedInUsd,
  strategyInfoUrl,
  learnMoreAboutUrl,
  lpTokenDecimals,
  aprTimeWindow,
  bCakeWrapper,
  minDepositUSD,
  boosterMultiplier,
}: Props) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false)
  const [removeLiquidityModalOpen, setRemoveLiquidityModalOpen] = useState(false)
  const hasStaked = useMemo(() => Boolean(staked0Amount) || Boolean(staked1Amount), [staked0Amount, staked1Amount])
  const { address: account } = useAccount()
  const showAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(true), [])
  const hideAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(false), [])

  const showRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(true), [])
  const hideRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(false), [])

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [currencyA ?? undefined, currencyB ?? undefined], [currencyA, currencyB]),
  )
  const userCurrencyBalances = {
    token0Balance: relevantTokenBalances[0],
    token1Balance: relevantTokenBalances[1],
  }
  const dividerBorderStyle = useMemo(() => `1px solid ${colors.input}`, [colors.input])
  const isSingleDepositToken0 = isSingleDepositToken && allowDepositToken0

  const { status } = useBoostStatusPM(Boolean(bCakeWrapper), boosterMultiplier, refetch)
  return (
    <>
      {hasStaked ? (
        <AtomBox mt="16px">
          <ActionContainer bg="background" flexDirection="column">
            <StakedAssets
              currencyA={currencyA}
              currencyB={currencyB}
              staked0Amount={staked0Amount}
              staked1Amount={staked1Amount}
              price={price}
              onAdd={showAddLiquidityModal}
              onRemove={showRemoveLiquidityModal}
              token0PriceUSD={token0PriceUSD}
              token1PriceUSD={token1PriceUSD}
              isSingleDepositToken={isSingleDepositToken}
              isSingleDepositToken0={isSingleDepositToken0}
            />
            <AtomBox
              width={{
                xs: '100%',
                md: 'auto',
              }}
              style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
            />
            {/* if (!isInCakeRewardDateRange && earningsBalance <= 0) return null  */}
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <RewardAssets
                contractAddress={contractAddress}
                bCakeWrapper={bCakeWrapper}
                pendingReward={pendingReward}
                earningToken={earningToken}
                isInCakeRewardDateRange={isInCakeRewardDateRange}
                refetch={refetch}
              />
            </RowBetween>
            {Boolean(bCakeWrapper) && (
              <>
                <AtomBox
                  width={{
                    xs: '100%',
                    md: 'auto',
                  }}
                  style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
                />
                <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
                  <StatusView
                    status={status}
                    isFarmStaking
                    boostedMultiplier={boosterMultiplier}
                    maxBoostMultiplier={3}
                  />
                </RowBetween>
              </>
            )}
          </ActionContainer>
        </AtomBox>
      ) : (
        <AtomBox mt="16px">
          <ActionContainer bg="background" flexDirection="column">
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <Title>start earning</Title>
              {!account ? (
                <ConnectWalletButton mt="4px" width="100%" />
              ) : (
                <Button variant="primary" width="100%" onClick={showAddLiquidityModal}>
                  {t('Add Liquidity')}
                </Button>
              )}
            </RowBetween>
            {Boolean(bCakeWrapper) && (
              <>
                <AtomBox
                  width={{
                    xs: '100%',
                    md: 'auto',
                  }}
                  style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
                />
                <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
                  <StatusView status={status} maxBoostMultiplier={3} />
                </RowBetween>
              </>
            )}
          </ActionContainer>
        </AtomBox>
      )}
      <AddLiquidity
        id={id}
        manager={manager}
        vaultName={vaultName}
        feeTier={feeTier}
        isOpen={addLiquidityModalOpen}
        onDismiss={hideAddLiquidityModal}
        currencyA={currencyA}
        currencyB={currencyB}
        ratio={ratio}
        earningToken={earningToken}
        isSingleDepositToken={isSingleDepositToken}
        allowDepositToken0={allowDepositToken0}
        allowDepositToken1={allowDepositToken1}
        contractAddress={contractAddress}
        userCurrencyBalances={userCurrencyBalances}
        userVaultPercentage={userVaultPercentage}
        poolToken0Amount={poolToken0Amount}
        poolToken1Amount={poolToken1Amount}
        token0PriceUSD={token0PriceUSD}
        token1PriceUSD={token1PriceUSD}
        rewardPerSecond={rewardPerSecond}
        aprDataInfo={aprDataInfo}
        rewardEndTime={rewardEndTime}
        refetch={refetch}
        rewardStartTime={rewardStartTime}
        totalAssetsInUsd={totalAssetsInUsd}
        totalSupplyAmounts={totalSupplyAmounts}
        userLpAmounts={userLpAmounts}
        precision={precision}
        totalStakedInUsd={totalStakedInUsd}
        strategyInfoUrl={strategyInfoUrl}
        learnMoreAboutUrl={learnMoreAboutUrl}
        lpTokenDecimals={lpTokenDecimals}
        aprTimeWindow={aprTimeWindow}
        bCakeWrapper={bCakeWrapper}
        minDepositUSD={minDepositUSD}
      />
      <RemoveLiquidity
        isOpen={removeLiquidityModalOpen}
        onDismiss={hideRemoveLiquidityModal}
        vaultName={vaultName}
        feeTier={feeTier}
        currencyA={currencyA}
        currencyB={currencyB}
        staked0Amount={staked0Amount}
        staked1Amount={staked1Amount}
        token0PriceUSD={token0PriceUSD}
        token1PriceUSD={token1PriceUSD}
        contractAddress={contractAddress}
        refetch={refetch}
        bCakeWrapper={bCakeWrapper}
      />
    </>
  )
})
