import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { usePositionManagerAdepterContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { memo, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useFarmsV3WithPositionsAndBooster } from 'state/farmsV3/hooks'
import { DuoTokenVaultCard } from '../components'
import { usePCSVault } from '../hooks'
import { usePositionInfo } from '../hooks/useAdapterInfo'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
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
    isSingleToken,
    allowDepositToken0,
    allowDepositToken1,
    priceFromV3FarmPid,
    managerInfoUrl,
    strategyInfoUrl,
  } = vault
  const managerInfo = useMemo(
    () => ({
      id: manager.id,
      name: manager.name,
    }),
    [manager],
  )
  const wrapperContract = usePositionManagerWrapperContract(address)
  const adapterAddress = useQuery(['adapterAddress', address], async () => wrapperContract.read.adapterAddr(), {
    enabled: !!wrapperContract,
  }).data
  const adapterContract = usePositionManagerAdepterContract(adapterAddress)
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

  const info = usePositionInfo(address, adapterAddress)

  const { farmsWithPositions: farmsV3 } = useFarmsV3WithPositionsAndBooster()
  const tokensPriceUSD = useMemo(() => {
    const farm = farmsV3.find((d) => d.pid === priceFromV3FarmPid)
    if (!farm) return undefined
    return { token0: Number(farm.tokenPriceBusd), token1: Number(farm.quoteTokenPriceBusd) }
  }, [farmsV3, priceFromV3FarmPid])

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
      isSingleToken={isSingleToken}
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
      managerAddress={address}
      vaultAddress={adapterAddress}
      managerInfoUrl={managerInfoUrl}
      strategyInfoUrl={strategyInfoUrl}
      refetch={info?.refetchPositionInfo}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
