import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { usePositionManagerAdepterContract } from 'hooks/useContract'
import { memo, useMemo } from 'react'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { DuoTokenVaultCard } from '../components'
import { usePCSVault, AprData, AprDataInfo } from '../hooks'
import { usePositionInfo } from '../hooks/useAdapterInfo'

interface Props {
  config: PCSDuoTokenVaultConfig
  farmsV3: FarmV3DataWithPriceAndUserInfo[]
  aprDataList: AprData
}

export const PCSVaultCard = memo(function PCSVaultCard({ config, farmsV3, aprDataList }: Props) {
  const { vault } = usePCSVault({ config })
  const {
    id,
    lpAddress,
    currencyA,
    currencyB,
    earningToken,
    name,
    strategy,
    feeTier,
    autoFarm,
    manager,
    managerFee,
    address,
    adapterAddress,
    isSingleDepositToken,
    allowDepositToken0,
    allowDepositToken1,
    priceFromV3FarmPid,
    managerInfoUrl,
    strategyInfoUrl,
    projectVaultUrl,
    rewardPerSecond,
    endTimestamp,
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

  const info = usePositionInfo(address, adapterAddress ?? '0x')

  const tokensPriceUSD = useMemo(() => {
    const farm = farmsV3.find((d) => d.pid === priceFromV3FarmPid)
    if (!farm) return undefined
    return { token0: Number(farm.tokenPriceBusd), token1: Number(farm.quoteTokenPriceBusd) }
  }, [farmsV3, priceFromV3FarmPid])

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
      info: data?.find((apr: AprDataInfo) => apr.lpAddress.toLowerCase() === lpAddress.toLowerCase()),
    }
  }, [lpAddress, aprDataList])

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
      managerFee={managerFee}
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
      lpAddress={lpAddress}
      vaultAddress={adapterAddress ?? '0x'}
      managerInfoUrl={managerInfoUrl}
      strategyInfoUrl={strategyInfoUrl}
      projectVaultUrl={projectVaultUrl}
      rewardPerSecond={rewardPerSecond}
      aprDataInfo={aprDataInfo}
      rewardEndTime={endTimestamp}
      refetch={info?.refetchPositionInfo}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
