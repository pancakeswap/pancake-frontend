import React, { useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Skeleton } from '@pancakeswap/uikit'
import { useFarmUser } from 'state/farms/hooks'
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance'

export interface StakedProps {
  pid: number
}

interface StakedWithLoading extends StakedProps {
  userDataReady: boolean
}

const StakedWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
`

const Staked: React.FC<StakedWithLoading> = ({ pid, userDataReady }) => {
  const { stakedBalance } = useFarmUser(pid)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  if (userDataReady) {
    return <StakedWrapper>{displayBalance()}</StakedWrapper>
  }

  return (
    <StakedWrapper>
      <Skeleton width={60} />
    </StakedWrapper>
  )
}

export default Staked
