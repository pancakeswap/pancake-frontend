import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap-libs/uikit'
import PastRoundCardError from './PastRoundCardError'
import PastRoundCardDetails from './PastRoundCardDetails'

const PastRoundCard = ({ error, data }) => {
  /* eslint-disable no-debugger */

  return (
    <Card>
      {error.message ? <PastRoundCardError error={error} data={data} /> : <PastRoundCardDetails data={data} />}
    </Card>
  )
}

export default PastRoundCard
