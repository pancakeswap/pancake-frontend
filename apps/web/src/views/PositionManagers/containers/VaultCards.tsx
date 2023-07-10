import { memo } from 'react'
import { isPCSVaultConfig } from '@pancakeswap/position-managers'

import { useVaultConfigs } from '../hooks'
import { PCSVaultCard } from './PCSVaultCard'
import { CardLayout } from '../components'

export const VaultCards = memo(function VaultCards() {
  const configs = useVaultConfigs()

  const cards = configs.map((config) => {
    if (isPCSVaultConfig(config)) {
      return <PCSVaultCard config={config} />
    }
    return null
  })

  return <CardLayout>{cards}</CardLayout>
})
