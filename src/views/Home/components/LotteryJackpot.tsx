import React from 'react'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'

const StyledLotteryJackpot = styled.div`
  font-size: 24px;
  font-weight: 900;
`

const LotteryJackpot = () => {
  const lotteryPrizeAmount = useTotalRewards()

  return (
    <StyledLotteryJackpot>
      {getBalanceNumber(lotteryPrizeAmount).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}
    </StyledLotteryJackpot>
  )
}

export default LotteryJackpot
