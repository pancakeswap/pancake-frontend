import { useTranslation } from '@pancakeswap/localization'

import { AtomBox, Button, Flex, RowBetween, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useCallback, useMemo, useState } from 'react'
import { useCurrencyBalances } from 'state/wallet/hooks'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { styled, useTheme } from 'styled-components'
import { StatusView } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusView'
import { StatusViewButtons } from 'views/Farms/components/YieldBooster/components/bCakeV3/StatusViewButtons'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { useBoostStatusPM } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBoostStatus'
import { useAccount } from 'wagmi'
import { usePMV2SSMaxBoostMultiplier, useWrapperBooster } from '../../hooks'
import { useOnStake } from '../../hooks/useOnStake'
import { AddLiquidity } from '../AddLiquidity'
import { LiquidityManagementProps } from '../LiquidityManagement'
import { RemoveLiquidity } from '../RemoveLiquidity'
import { RewardAssets } from '../RewardAssets'
import { StakedAssets } from '../StakedAssets'

export const ActionContainer = styled(Flex)`
  width: 100%;
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
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
  margin-bottom: 8px;
`

export const LiquidityManagement = memo(function LiquidityManagement({
  id,
  manager,
  currencyA,
  currencyB,
  earningToken,
  vaultName,
  feeTier,
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
  totalStakedInUsd,
  strategyInfoUrl,
  learnMoreAboutUrl,
  lpTokenDecimals,
  aprTimeWindow,
  bCakeWrapper,
  minDepositUSD,
  boosterMultiplier,
  isBooster,
  boosterContractAddress,
  adapterAddress,
}: LiquidityManagementProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false)
  const [removeLiquidityModalOpen, setRemoveLiquidityModalOpen] = useState(false)
  const hasStaked = useMemo(() => Boolean(staked0Amount) || Boolean(staked1Amount), [staked0Amount, staked1Amount])
  const { address: account } = useAccount()
  const showAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(true), [])
  const hideAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(false), [])
  const { maxBoostMultiplier } = usePMV2SSMaxBoostMultiplier()

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
  const { shouldUpdate, veCakeUserMultiplierBeforeBoosted } = useWrapperBooster(
    boosterContractAddress ?? '0x',
    boosterMultiplier ?? 1,
    bCakeWrapper,
  )
  const { isTxLoading, onStake, onUpdate } = useOnStake(manager.id, contractAddress, bCakeWrapper)
  const { locked } = useBCakeBoostLimitAndLockInfo()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <>
      {hasStaked ? (
        <AtomBox>
          <ActionContainer
            flexDirection={!isDesktop ? 'column' : 'row'}
            style={{ flexWrap: isDesktop ? 'nowrap' : 'wrap' }}
          >
            <Flex flexDirection="column" flexBasis="50%">
              <StakedAssets
                currencyA={currencyA}
                currencyB={currencyB}
                staked0Amount={staked0Amount}
                staked1Amount={staked1Amount}
                onAdd={showAddLiquidityModal}
                onRemove={showRemoveLiquidityModal}
                token0PriceUSD={token0PriceUSD}
                token1PriceUSD={token1PriceUSD}
                isSingleDepositToken={isSingleDepositToken}
                isSingleDepositToken0={isSingleDepositToken0}
              />
              {!isDesktop && (
                <AtomBox
                  width={{
                    xs: '100%',
                    md: 'auto',
                  }}
                  style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
                />
              )}
            </Flex>
            {isDesktop && (
              <AtomBox
                height={{
                  xs: '100%',
                  md: 'auto',
                }}
                style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
              />
            )}
            <Flex flexDirection="column" flexGrow={1} style={{ gap: 16 }}>
              <RowBetween
                flexDirection="column"
                justifyContent="center"
                alignItems={!isDesktop ? 'flex-start' : 'center'}
                flex={1}
                width="100%"
              >
                <RewardAssets
                  contractAddress={contractAddress}
                  bCakeWrapper={bCakeWrapper}
                  pendingReward={pendingReward}
                  earningToken={earningToken}
                  refetch={refetch}
                />
              </RowBetween>
              {isBooster && (
                <>
                  <AtomBox
                    width={{
                      xs: '100%',
                      md: 'auto',
                    }}
                    style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
                  />
                  <RowBetween
                    flexDirection="column"
                    alignItems={!isDesktop ? 'flex-start' : 'center'}
                    flex={1}
                    width="100%"
                  >
                    <Flex width="100%" justifyContent="space-between" alignItems="center">
                      <StatusView
                        status={status}
                        isFarmStaking
                        boostedMultiplier={boosterMultiplier}
                        maxBoostMultiplier={maxBoostMultiplier}
                        shouldUpdate={shouldUpdate}
                        expectMultiplier={veCakeUserMultiplierBeforeBoosted}
                      />
                      <StatusViewButtons
                        updateButton={
                          shouldUpdate ? <Button onClick={() => onUpdate(refetch)}>{t('Update')}</Button> : null
                        }
                        locked={locked}
                        isTableView
                      />
                    </Flex>
                  </RowBetween>
                </>
              )}
            </Flex>
          </ActionContainer>
        </AtomBox>
      ) : (
        <AtomBox mt="16px">
          <ActionContainer bg="background" flexDirection="column">
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
              <Title>{t('Start earning')}</Title>
              {!account ? (
                <ConnectWalletButton mt="4px" width="100%" />
              ) : (
                <Button variant="primary" width="100%" onClick={showAddLiquidityModal}>
                  {t('Add Liquidity')}
                </Button>
              )}
            </RowBetween>
            {isBooster && (
              <>
                <AtomBox
                  width={{
                    xs: '100%',
                    md: 'auto',
                  }}
                  style={{ borderLeft: dividerBorderStyle, borderTop: dividerBorderStyle }}
                />
                <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
                  <Flex width="100%" justifyContent="space-between" alignItems="center">
                    <StatusView status={status} maxBoostMultiplier={maxBoostMultiplier} />
                    <StatusViewButtons updateButton={null} locked={locked} isTableView />
                  </Flex>
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
        boosterMultiplier={boosterMultiplier}
        isBooster={isBooster}
        onStake={onStake}
        isTxLoading={isTxLoading}
        adapterAddress={adapterAddress}
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
        manager={manager}
        bCakeWrapper={bCakeWrapper}
      />
    </>
  )
})
