import React from 'react'
import { useTotalClaim } from 'hooks/useTickets'
import CardValue from 'components/Card/CardValue'

const CakeWinnings = () => {
  const { claimAmount } = useTotalClaim()
  return <CardValue value={claimAmount.toNumber()} />
}

export default CakeWinnings
