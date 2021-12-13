import React from 'react'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { useIfoPoolContext } from '../context'

const IfoPoolVaultCard = () => {
  const { pool } = useIfoPoolContext()
  return <CakeVaultCard pool={pool} showStakedOnly={false} m="auto" />
}

export default IfoPoolVaultCard
