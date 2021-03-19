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
  const cakeAmount = getBalanceNumber(claimAmount)
  const claimAmountBusd = new BigNumber(cakeAmount).multipliedBy(usePriceCakeBusd()).toNumber()

  return (
    <Block>
      <CardValue value={cakeAmount} lineHeight="1.5" />
      <CardBusdValue value={claimAmountBusd} decimals={2} />
    </Block>
  )
}

export default CakeWinnings
