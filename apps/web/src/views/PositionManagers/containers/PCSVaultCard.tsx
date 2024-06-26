import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { usePositionManagerAdapterContract } from 'hooks/useContract'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { memo, useEffect, useMemo } from 'react'
import { DuoTokenVaultCard } from '../components'
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
} from '../hooks'
import { TIME_WINDOW_DEFAULT, TIME_WINDOW_FALLBACK } from '../hooks/useFetchApr'

interface Props {
  config: PCSDuoTokenVaultConfig
  farmsV3: FarmV3DataWithPriceAndUserInfo[]
  aprDataList: AprData
  updatePositionMangerDetailsData: (id: number, newData: PositionManagerDetailsData) => void
}

export const ThirdPartyVaultCard = memo(function PCSVaultCard({
  config,
  aprDataList,
  updatePositionMangerDetailsData,
}: Props) {
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
    autoFarm,
    manager,
    address,
    adapterAddress,
    isSingleDepositToken,
    allowDepositToken0,
    allowDepositToken1,
    managerInfoUrl,
    strategyInfoUrl,
    projectVaultUrl,
    learnMoreAboutUrl,
    aprTimeWindow,
    bCakeWrapperAddress,
    minDepositUSD,
  } = vault

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

  const info = usePositionInfo(bCakeWrapperAddress ?? address, adapterAddress ?? '0x', Boolean(bCakeWrapperAddress))

  const { data: token0USDPrice } = useCurrencyUsdPrice(currencyA)
  const { data: token1USDPrice } = useCurrencyUsdPrice(currencyB)
  const tokensPriceUSD = useMemo(() => {
    return {
      token0: token0USDPrice ?? 0,
      token1: token1USDPrice ?? 0,
    }
  }, [token0USDPrice, token1USDPrice])
  const managerInfo = useMemo(
    () => ({
      id: manager.id,
      name: manager.name,
    }),
    [manager],
  )

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
  return (
    <DuoTokenVaultCard
      id={id}
      idByManager={idByManager}
      currencyA={currencyA}
      currencyB={currencyB}
      earningToken={earningToken}
      name={name}
      strategy={strategy}
      feeTier={feeTier}
      autoFarm={autoFarm}
      manager={managerInfo}
      managerFee={info?.managerFeePercentage}
      ratio={Number.isNaN(tokenRatio) ? 1 / (tokensPriceUSD.token0 / tokensPriceUSD.token1) : tokenRatio ?? 1}
      isSingleDepositToken={isSingleDepositToken}
      allowDepositToken0={allowDepositToken0}
      allowDepositToken1={allowDepositToken1}
      contractAddress={address}
      stakedToken0Amount={info?.userToken0Amounts}
      stakedToken1Amount={info?.userToken1Amounts}
      token0PriceUSD={tokensPriceUSD?.token0}
      token1PriceUSD={tokensPriceUSD?.token1}
      poolToken0Amount={info?.poolToken0Amounts}
      poolToken1Amount={info?.poolToken1Amounts}
      pendingReward={info?.pendingReward}
      userVaultPercentage={info?.userVaultPercentage}
      managerAddress={info?.managerAddress ?? '0x'}
      managerInfoUrl={managerInfoUrl}
      strategyInfoUrl={strategyInfoUrl}
      projectVaultUrl={projectVaultUrl}
      rewardPerSecond={info.rewardPerSecond}
      aprDataInfo={aprDataInfo}
      rewardEndTime={info.endTimestamp}
      rewardStartTime={info.startTimestamp}
      refetch={info?.refetchPositionInfo}
      totalAssetsInUsd={totalAssetsInUsd}
      totalSupplyAmounts={info?.totalSupplyAmounts}
      userLpAmounts={info?.userLpAmounts}
      precision={info?.precision}
      totalStakedInUsd={totalStakedInUsd}
      learnMoreAboutUrl={learnMoreAboutUrl}
      lpTokenDecimals={info?.lpTokenDecimals}
      bCakeWrapper={bCakeWrapperAddress}
      minDepositUSD={minDepositUSD}
      boosterMultiplier={info?.boosterMultiplier}
      boosterContractAddress={info?.boosterContractAddress}
      adapterAddress={adapterAddress}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
