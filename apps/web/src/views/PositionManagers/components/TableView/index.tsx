import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { SwellTooltip } from 'components/SwellTooltip/SwellTooltip'
import { usePositionManagerAdapterContract } from 'hooks/useContract'
import { useHasSwellReward } from 'hooks/useHasSwellReward'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'

/* eslint-disable no-case-declarations */
import { useDelayedUnmount } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsWrapperWhiteList } from '../../hooks/useWrapperBooster'
import { ActionPanel } from './ActionPanel'

import {
  AprData,
  AprDataInfo,
  PositionManagerDetailsData,
  useApr,
  useEarningTokenPriceInfo,
  usePCSVault,
  usePositionInfo,
  useTotalAssetInUsd,
  useTotalStakedInUsd,
} from '../../hooks'
import { RewardPerDay } from '../RewardPerDay'

import { getVaultName } from '../../utils'
import { AprButton } from '../AprButton'
import { CellLayout } from './CellLayout'
import { Details } from './Details'
import { FarmCell } from './FarmCell'
import { AprMobileCell, CellInner, FarmMobileCell, StyledTr } from './Styled'

import { TIME_WINDOW_DEFAULT, TIME_WINDOW_FALLBACK } from '../../hooks/useFetchApr'

interface Props {
  config: PCSDuoTokenVaultConfig
  farmsV3: FarmV3DataWithPriceAndUserInfo[]
  aprDataList: AprData
  updatePositionMangerDetailsData: (id: number, newData: PositionManagerDetailsData) => void
}

export const TableRow: React.FC<Props> = ({ config, farmsV3, aprDataList, updatePositionMangerDetailsData }) => {
  const hasStakedAmount = false
  const { locked } = useBCakeBoostLimitAndLockInfo()
  const { t } = useTranslation()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const toggleActionPanel = useCallback(() => {
    setActionPanelExpanded(!actionPanelExpanded)
  }, [actionPanelExpanded])
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])
  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop

  const columnNames = useMemo(() => ['title', 'apr', 'earn', 'rewardPerDay', 'totalStaked', 'details'], [])

  const { vault } = usePCSVault({ config })
  const {
    id,
    idByManager,
    currencyA,
    currencyB,
    earningToken,
    name,
    strategy,
    feeTier,
    manager,
    address,
    adapterAddress,
    isSingleDepositToken,
    allowDepositToken0,
    allowDepositToken1,
    priceFromV3FarmPid,
    managerInfoUrl,
    strategyInfoUrl,
    projectVaultUrl,
    learnMoreAboutUrl,
    minDepositUSD,
    aprTimeWindow,
    bCakeWrapperAddress,
    autoCompound,
  } = vault

  const hasSwellReward = useHasSwellReward(address)
  const adapterContract = usePositionManagerAdapterContract(adapterAddress ?? '0x')
  const tokenRatio = useQuery({
    queryKey: ['adapterAddress', adapterAddress, id],

    queryFn: async () => {
      const result = await adapterContract.read.tokenPerShare()
      return new BigNumber(result[0].toString())
        .div(new BigNumber(10).pow(currencyA.decimals))
        .div(new BigNumber(result[1].toString()).div(new BigNumber(10).pow(currencyB.decimals)))
        .toNumber()
    },

    enabled: !!adapterContract,
    refetchInterval: 6000,
    staleTime: 6000,
    gcTime: 6000,
  }).data

  const token0Usd = useCurrencyUsdPrice(currencyA, {
    enabled: !priceFromV3FarmPid,
  })
  const token1Usd = useCurrencyUsdPrice(currencyB, {
    enabled: !priceFromV3FarmPid,
  })
  const vaultName = useMemo(() => getVaultName(idByManager, name), [name, idByManager])
  const info = usePositionInfo(bCakeWrapperAddress ?? address, adapterAddress ?? '0x', Boolean(bCakeWrapperAddress))

  const tokensPriceUSD = useMemo(() => {
    const farm = priceFromV3FarmPid ? farmsV3.find((d) => d.pid === priceFromV3FarmPid) : undefined
    if (!farm)
      return {
        token0: token0Usd.data ?? 0,
        token1: token1Usd.data ?? 0,
      }
    const isToken0And1Reversed =
      farm.token.address.toLowerCase() === (currencyB.isToken ? currencyB.address.toLowerCase() : '')
    return {
      token0: Number(isToken0And1Reversed ? farm.quoteTokenPriceBusd : farm.tokenPriceBusd),
      token1: Number(isToken0And1Reversed ? farm.tokenPriceBusd : farm.quoteTokenPriceBusd),
    }
  }, [farmsV3, token0Usd.data, token1Usd.data, currencyB, priceFromV3FarmPid])

  useEffect(() => {
    if (info?.userToken0Amounts > 0n || info?.userToken1Amounts > 0n) {
      setActionPanelExpanded(true)
    }
  }, [info?.userToken0Amounts, info?.userToken1Amounts])
  const aprDataInfo = useMemo(() => {
    const { isLoading, data, fallbackData, specificData } = aprDataList
    let timeWindow = TIME_WINDOW_FALLBACK

    let aprInfo: AprDataInfo | undefined
    if (specificData?.[aprTimeWindow ?? -1]) {
      aprInfo = specificData?.[aprTimeWindow ?? -1]?.find(
        (apr: AprDataInfo) => apr.lpAddress.toLowerCase() === info.vaultAddress?.toLowerCase(),
      )
      if (aprInfo && aprTimeWindow) timeWindow = aprTimeWindow
    }
    if (!aprInfo && data?.length) {
      aprInfo = data?.find((apr: AprDataInfo) => apr.lpAddress.toLowerCase() === info.vaultAddress?.toLowerCase())
      if (aprInfo) timeWindow = TIME_WINDOW_DEFAULT
    }
    if (!aprInfo || aprInfo?.token0 === 0 || aprInfo?.token1 === 0) {
      aprInfo = fallbackData?.find(
        (apr: AprDataInfo) => apr.lpAddress.toLowerCase() === info.vaultAddress?.toLowerCase(),
      )
      timeWindow = TIME_WINDOW_FALLBACK
    }
    return {
      isLoading,
      info: aprInfo,
      timeWindow,
    }
  }, [aprDataList, aprTimeWindow, info.vaultAddress])

  const { earningUsdValue } = useEarningTokenPriceInfo(earningToken, info?.pendingReward)

  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount: info?.poolToken0Amounts,
    poolToken1Amount: info?.poolToken1Amounts,
    token0PriceUSD: tokensPriceUSD?.token0,
    token1PriceUSD: tokensPriceUSD?.token1,
  })

  const apr = useApr({
    currencyA,
    currencyB,
    poolToken0Amount: info?.poolToken0Amounts,
    poolToken1Amount: info?.poolToken1Amounts,
    token0PriceUSD: tokensPriceUSD?.token0,
    token1PriceUSD: tokensPriceUSD?.token1,
    rewardPerSecond: info.rewardPerSecond,
    earningToken,
    avgToken0Amount: aprDataInfo?.info?.token0 ?? 0,
    avgToken1Amount: aprDataInfo?.info?.token1 ?? 0,
    rewardEndTime: info.endTimestamp,
    rewardStartTime: info.startTimestamp,
    farmRewardAmount: aprDataInfo?.info?.rewardAmount ?? 0,
    adapterAddress,
    bCakeWrapperAddress,
  })

  const staked0Amount = info?.userToken0Amounts
    ? CurrencyAmount.fromRawAmount(currencyA, info.userToken0Amounts)
    : undefined
  const staked1Amount = info?.userToken1Amounts
    ? CurrencyAmount.fromRawAmount(currencyB, info.userToken1Amounts)
    : undefined
  const totalAssetsInUsd = useTotalAssetInUsd(
    staked0Amount,
    staked1Amount,
    tokensPriceUSD?.token0,
    tokensPriceUSD?.token1,
  )

  useEffect(() => {
    updatePositionMangerDetailsData(id, {
      apr: apr ? Number(apr.combinedApr) : 0,
      earned: earningUsdValue,
      totalStaked: totalStakedInUsd,
      isUserStaked: totalAssetsInUsd > 0,
      startTime: info.startTimestamp,
      endTime: info.endTimestamp,
    })
  }, [
    earningUsdValue,
    totalStakedInUsd,
    id,
    totalAssetsInUsd,
    apr,
    updatePositionMangerDetailsData,
    info.startTimestamp,
    info.endTimestamp,
  ])

  const tokenPerSecond = useMemo(() => {
    return getBalanceAmount(
      new BigNumber(info?.rewardPerSecond ? info?.rewardPerSecond : 0),
      earningToken.decimals,
    ).toNumber()
  }, [info?.rewardPerSecond, earningToken])

  const earning = useMemo(
    () => (apr.isInCakeRewardDateRange ? `${earningToken.symbol} + ${t('Fees')}` : t('Fees')),
    [t, apr.isInCakeRewardDateRange, earningToken],
  )

  const { isBoosterWhiteList } = useIsWrapperWhiteList(info?.boosterContractAddress, bCakeWrapperAddress)

  return (
    <>
      {!isMobile ? (
        <StyledTr onClick={toggleActionPanel}>
          {columnNames.map((key) => {
            switch (key) {
              case 'title':
                return (
                  <td key={key}>
                    <CellInner style={{ minWidth: '140px', gap: '0.5rem' }}>
                      <FarmCell
                        currencyA={currencyA}
                        currencyB={currencyB}
                        vaultName={vaultName}
                        feeTier={feeTier}
                        autoCompound={autoCompound}
                        isSingleDepositToken={isSingleDepositToken}
                        allowDepositToken1={allowDepositToken1 ?? false}
                        isBooster={isBoosterWhiteList && apr?.isInCakeRewardDateRange}
                      />
                      {hasSwellReward ? <SwellTooltip /> : null}
                    </CellInner>
                  </td>
                )
              case 'details':
                return (
                  <td key={key}>
                    <CellInner
                      style={{
                        justifyContent: 'flex-end',
                      }}
                    >
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )

              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('APR')}>
                        <AprButton
                          id={id}
                          apr={apr}
                          isAprLoading={aprDataInfo.isLoading}
                          lpSymbol={`${currencyA.symbol}-${currencyB.symbol} LP`}
                          totalAssetsInUsd={totalAssetsInUsd}
                          totalSupplyAmounts={info?.totalSupplyAmounts}
                          totalStakedInUsd={totalStakedInUsd}
                          userLpAmounts={info?.userLpAmounts}
                          precision={info?.precision}
                          lpTokenDecimals={info?.lpTokenDecimals}
                          aprTimeWindow={aprTimeWindow}
                          rewardToken={earningToken}
                          isBooster={isBoosterWhiteList && apr?.isInCakeRewardDateRange}
                          boosterMultiplier={
                            totalAssetsInUsd === 0 || !locked
                              ? 3
                              : info?.boosterMultiplier === 0
                              ? 3
                              : info?.boosterMultiplier
                          }
                        />
                      </CellLayout>
                    </CellInner>
                  </td>
                )

              case 'rewardPerDay':
                return isSmallerScreen ? null : (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Reward Per Day')}>
                        <RewardPerDay
                          rewardPerSec={(apr?.isInCakeRewardDateRange ? tokenPerSecond : 0) ?? 0}
                          symbol={earningToken.symbol ?? undefined}
                          scale="sm"
                          style={{ marginTop: 5 }}
                        />
                      </CellLayout>
                    </CellInner>
                  </td>
                )

              case 'earn':
                return isSmallerScreen ? null : (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Earn')}>{earning}</CellLayout>
                    </CellInner>
                  </td>
                )
              case 'totalStaked':
                return isSmallerScreen ? null : (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Total Staked')}>
                        $
                        {totalStakedInUsd.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default:
                return null
            }
          })}
        </StyledTr>
      ) : (
        <>
          <tr style={{ cursor: 'pointer' }} onClick={toggleActionPanel}>
            <FarmMobileCell colSpan={3}>
              <Flex justifyContent="flex-start" alignItems="center" position="relative">
                <FarmCell
                  currencyA={currencyA}
                  currencyB={currencyB}
                  vaultName={vaultName}
                  feeTier={feeTier}
                  autoCompound={autoCompound}
                  isSingleDepositToken={isSingleDepositToken}
                  allowDepositToken1={allowDepositToken1 ?? false}
                  isBooster={isBoosterWhiteList && apr?.isInCakeRewardDateRange}
                />
                {hasSwellReward ? (
                  <Box position="absolute" right="10px">
                    <SwellTooltip />
                  </Box>
                ) : null}
              </Flex>
            </FarmMobileCell>
          </tr>
          <StyledTr onClick={toggleActionPanel}>
            <td width="33%">
              <AprMobileCell style={{ paddingLeft: 20 }}>
                <CellLayout label={t('APR')}>
                  <AprButton
                    id={id}
                    apr={apr}
                    isAprLoading={aprDataInfo.isLoading}
                    lpSymbol={`${currencyA.symbol}-${currencyB.symbol} LP`}
                    totalAssetsInUsd={totalAssetsInUsd}
                    totalSupplyAmounts={info?.totalSupplyAmounts}
                    totalStakedInUsd={totalStakedInUsd}
                    userLpAmounts={info?.userLpAmounts}
                    precision={info?.precision}
                    lpTokenDecimals={info?.lpTokenDecimals}
                    aprTimeWindow={aprTimeWindow}
                    rewardToken={earningToken}
                    isBooster={isBoosterWhiteList && apr?.isInCakeRewardDateRange}
                    boosterMultiplier={
                      totalAssetsInUsd === 0 || !locked
                        ? 3
                        : info?.boosterMultiplier === 0
                        ? 3
                        : info?.boosterMultiplier
                    }
                  />
                </CellLayout>
              </AprMobileCell>
            </td>
            <td width="33%">
              <CellInner style={{ justifyContent: 'flex-end' }}>
                <Details actionPanelToggled={actionPanelExpanded} />
              </CellInner>
            </td>
          </StyledTr>
        </>
      )}
      {shouldRenderChild && (
        <tr>
          <td colSpan={9}>
            <ActionPanel
              currencyA={currencyA}
              currencyB={currencyB}
              managerFee={info?.managerFeePercentage}
              token0PriceUSD={tokensPriceUSD?.token0}
              token1PriceUSD={tokensPriceUSD?.token1}
              poolToken0Amount={info?.poolToken0Amounts}
              poolToken1Amount={info?.poolToken1Amounts}
              allowDepositToken0={Boolean(allowDepositToken0)}
              allowDepositToken1={Boolean(allowDepositToken1)}
              isSingleDepositToken={isSingleDepositToken}
              tokenPerSecond={tokenPerSecond}
              earningToken={earningToken}
              isInCakeRewardDateRange={apr.isInCakeRewardDateRange}
              manager={manager}
              vaultAddress={address}
              managerAddress={info?.managerAddress ?? ''}
              managerInfoUrl={managerInfoUrl}
              strategyInfoUrl={strategyInfoUrl}
              projectVaultUrl={projectVaultUrl}
              strategy={strategy}
              boosterMultiplier={info?.boosterMultiplier}
              id={id.toString()}
              totalAssetsInUsd={totalAssetsInUsd}
              vaultName={vaultName}
              feeTier={feeTier}
              ratio={Number.isNaN(tokenRatio) ? 1 / (tokensPriceUSD.token0 / tokensPriceUSD.token1) : tokenRatio ?? 1}
              contractAddress={address}
              staked0Amount={staked0Amount}
              staked1Amount={staked1Amount}
              pendingReward={info?.pendingReward}
              aprDataInfo={aprDataInfo}
              rewardPerSecond={info.rewardPerSecond}
              rewardEndTime={info.endTimestamp}
              rewardStartTime={info.startTimestamp}
              refetch={info?.refetchPositionInfo}
              totalSupplyAmounts={info?.totalSupplyAmounts}
              userLpAmounts={info?.userLpAmounts}
              precision={info?.precision}
              totalStakedInUsd={totalStakedInUsd}
              learnMoreAboutUrl={learnMoreAboutUrl}
              lpTokenDecimals={info?.lpTokenDecimals}
              aprTimeWindow={aprDataInfo.timeWindow}
              bCakeWrapper={bCakeWrapperAddress}
              minDepositUSD={minDepositUSD}
              adapterAddress={adapterAddress}
              isBooster={isBoosterWhiteList}
              boosterContractAddress={info?.boosterContractAddress}
            />
          </td>
        </tr>
      )}
    </>
  )
}
