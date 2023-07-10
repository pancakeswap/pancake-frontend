import { memo } from 'react'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'

import { usePCSVault } from '../hooks'
import { DuoTokenVaultCard } from '../components'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
  const { vault } = usePCSVault({ config })
  const { id, currencyA, currencyB, name, strategy } = vault

  console.log(vault)
  return (
    <DuoTokenVaultCard key={id} currencyA={currencyA} currencyB={currencyB} name={name} strategy={strategy}>
      {id}
    </DuoTokenVaultCard>
  )
})
