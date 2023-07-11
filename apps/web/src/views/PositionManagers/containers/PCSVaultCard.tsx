import { memo } from 'react'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'

import { usePCSVault } from '../hooks'
import { DuoTokenVaultCard } from '../components'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
  const { vault } = usePCSVault({ config })
  const { id, currencyA, currencyB, name, strategy, feeTier, autoFarm } = vault

  console.log(vault)
  return (
    <DuoTokenVaultCard
      key={id}
      id={id}
      currencyA={currencyA}
      currencyB={currencyB}
      name={name}
      strategy={strategy}
      feeTier={feeTier}
      autoFarm={autoFarm}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
