import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { usePositionManagerAdepterContract } from 'hooks/useContract'
import { memo, useMemo, useEffect } from 'react'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { DuoTokenVaultCard } from '../components'
import {
  usePCSVault,
  AprData,
  AprDataInfo,
  PositionManagerDetailsData,
  useEarningTokenPriceInfo,
  useTotalStakedInUsd,
  usePositionInfo,
  useApr,
  useTotalAssetInUsd,
  useTokenPriceFromSubgraph,
} from '../hooks'

interface Props {
  config: PCSDuoTokenVaultConfig
  farmsV3: FarmV3DataWithPriceAndUserInfo[]
  aprDataList: AprData
  updatePositionMangerDetailsData: (id: number, newData: PositionManagerDetailsData) => void
}

export const PCSVaultCard = memo(function PCSVaultCard({
  config,
  farmsV3,
  aprDataList,
  updatePositionMangerDetailsData,
}: Props) {
  const { vault } = usePCSVault({ config })
  const {
    id,
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
    priceFromV3FarmPid,
    managerInfoUrl,
    strategyInfoUrl,
    projectVaultUrl,
    learnMoreAboutUrl,
  } = vault

  const adapterContract = usePositionManagerAdepterContract(adapterAddress ?? '0x')
  const tokenRatio = useQuery(
    ['adapterAddress', adapterAddress],
    async () => {
      const result = await adapterContract.read.tokenPerShare()
      return Number((result[0] * 100n) / result[1]) / 100
    },
    {
      enabled: !!adapterContract,
    },
  ).data
  const priceFromSubgraph = useTokenPriceFromSubgraph(
    priceFromV3FarmPid ? undefined : currencyA.isToken ? currencyA.address.toLowerCase() : undefined,
    priceFromV3FarmPid ? undefined : currencyB.isToken ? currencyB.address.toLowerCase() : undefined,
  )

  const info = usePositionInfo(address, adapterAddress ?? '0x')

  const tokensPriceUSD = useMemo(() => {
    const farm = farmsV3.find((d) => d.pid === priceFromV3FarmPid)
    if (!farm) return priceFromSubgraph
    const isToken0And1Reversed =
      farm.token.address.toLowerCase() === (currencyB.isToken ? currencyB.address.toLowerCase() : '')
    return {
      token0: Number(isToken0And1Reversed ? farm.quoteTokenPriceBusd : farm.tokenPriceBusd),
      token1: Number(isToken0And1Reversed ? farm.tokenPriceBusd : farm.quoteTokenPriceBusd),
    }
  }, [farmsV3, priceFromV3FarmPid, priceFromSubgraph, currencyB])

  const managerInfo = useMemo(
    () => ({
      id: manager.id,
      name: manager.name,
    }),
    [manager],
  )

  const aprDataInfo = useMemo(() => {
    const { isLoading, data } = aprDataList
    return {
      isLoading,
      info: data?.length
        ? data?.find((apr: AprDataInfo) => apr.lpAddress.toLowerCase() === info.vaultAddress?.toLowerCase())
        : undefined,
    }
  }, [info.vaultAddress, aprDataList])

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
    })
  }, [earningUsdValue, totalStakedInUsd, id, totalAssetsInUsd, apr, updatePositionMangerDetailsData])
  return (
    <DuoTokenVaultCard
      id={id}
      currencyA={currencyA}
      currencyB={currencyB}
      earningToken={earningToken}
      name={name}
      strategy={strategy}
      feeTier={feeTier}
      autoFarm={autoFarm}
      manager={managerInfo}
      managerFee={info?.managerFeePercentage}
      ratio={tokenRatio ?? 1}
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
    >
      {id}
    </DuoTokenVaultCard>
  )
})
