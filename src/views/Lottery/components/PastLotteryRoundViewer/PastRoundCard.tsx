import React from 'react'
import { Card } from '@pancakeswap-libs/uikit'
import PastRoundCardError from './PastRoundCardError'
import PastRoundCardDetails from './PastRoundCardDetails'

const PastRoundCard = ({ error, data }) => {
  return <Card>{error.message ? <PastRoundCardError error={error} /> : <PastRoundCardDetails data={data} />}</Card>
}

export default PastRoundCard
