import { memo } from 'react'
import { isPCSVaultConfig } from '@pancakeswap/position-managers'
import { useFarmsV3WithPositionsAndBooster } from 'state/farmsV3/hooks'

import { useVaultConfigs, useFetchApr } from '../hooks'
import { PCSVaultCard } from './PCSVaultCard'
import { CardLayout } from '../components'

export const VaultCards = memo(function VaultCards() {
  const configs = useVaultConfigs()
  const aprDataList = useFetchApr()
  const { farmsWithPositions: farmsV3 } = useFarmsV3WithPositionsAndBooster()

  const cards = configs.map((config) => {
    if (isPCSVaultConfig(config)) {
      return <PCSVaultCard key={config.id} config={config} farmsV3={farmsV3} aprDataList={aprDataList} />
    }
    return null
  })

  return <CardLayout>{cards}</CardLayout>
})
