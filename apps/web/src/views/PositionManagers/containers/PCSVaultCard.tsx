import { memo } from 'react'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'

import { usePCSVault } from '../hooks'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
  const { vault } = usePCSVault({ config })

  console.log(vault)
  return <div>{vault.id}</div>
})
