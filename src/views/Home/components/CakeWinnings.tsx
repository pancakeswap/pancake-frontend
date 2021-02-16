import React from 'react'
import { useTotalClaim } from 'hooks/useTickets'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
 }
`
const CakeWinnings = () => {
  const { claimAmount } = useTotalClaim()
  const claimAmountBusd = new BigNumber(claimAmount).multipliedBy(usePriceCakeBusd()).toNumber()

  return (
    <Block>
      <CardValue value={getBalanceNumber(claimAmount)} lineHeight="1.5" />
      <CardBusdValue value={claimAmountBusd} />
    </Block>
  )
}

export default CakeWinnings
