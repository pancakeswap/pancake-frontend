import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalClaim } from 'hooks/useTickets'

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const SecondCardColumnWrapper = styled.div<{ isAWin?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isAWin ? 'column' : 'column-reverse')};
`

const Lottery: React.FC = () => {
  const { account } = useWallet()
  const { claimAmount } = useTotalClaim()
  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0
  const [nextDrawActive, setNextDrawActive] = useState(true)

  // May be useful for 'Past draws'
  // const sushi = useSushi()
  // const lotteryContract = getLotteryContract(sushi)
  // const [index, setIndex] = useState(0)

  // const fetchIndex = useCallback(async () => {
  //   const issueIndex = await getLotteryIssueIndex(lotteryContract)
  //   setIndex(issueIndex)
  // }, [lotteryContract])

  // useEffect(() => {
  //   if (account && lotteryContract && sushi) {
  //     fetchIndex()
  //   }
  // }, [account, lotteryContract, sushi, fetchIndex])

  return <div>Wat</div>
}

export default Lottery
