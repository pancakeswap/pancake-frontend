import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'
import { usePositionManagerAdepterContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { memo, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { DuoTokenVaultCard } from '../components'
import { usePCSVault } from '../hooks'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
  const { vault } = usePCSVault({ config })
  const {
    id,
    currencyA,
    currencyB,
    name,
    strategy,
    feeTier,
    autoFarm,
    manager,
    managerFee,
    address,
    allowDepositToken0,
    allowDepositToken1,
  } = vault
  const managerInfo = useMemo(
    () => ({
      id: manager.id,
      name: manager.name,
    }),
    [manager],
  )
  const wrapperContract = usePositionManagerWrapperContract(address)
  const adapterAddress = useQuery(
    ['adapterAddress', address],
    async () => {
      return wrapperContract.read.adapterAddr()
    },
    {
      enabled: !!wrapperContract,
    },
  ).data
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
  return (
    <DuoTokenVaultCard
      id={id}
      currencyA={currencyA}
      currencyB={currencyB}
      name={name}
      strategy={strategy}
      feeTier={feeTier}
      autoFarm={autoFarm}
      manager={managerInfo}
      managerFee={managerFee}
      ratio={tokenRatio ?? 1}
      allowDepositToken0={allowDepositToken0}
      allowDepositToken1={allowDepositToken1}
      contractAddress={address}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
