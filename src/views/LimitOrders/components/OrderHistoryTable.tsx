import React, { useMemo } from 'react'
import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Order } from '@gelatonetwork/limit-orders-lib'
import useGelatoLimitOrdersHistory from 'hooks/limitOrders/useGelatoLimitOrdersHistory'
import { getBscScanLink } from 'utils'
import { useCurrency } from 'hooks/Tokens'
import { CurrencyAmount, Token, TokenAmount } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'

const StyledRow = styled(Flex)`
  span {
    padding-right: 8px;
  }
`

const Row: React.FC<{ order: Order }> = ({ order }) => {
  const { account, chainId } = useActiveWeb3React()
  const gelatoLibrary = useGelatoLimitOrdersLib()

  const inputToken = useCurrency(order.inputToken)
  const outputToken = useCurrency(order.outputToken)
  const inputAmount = useMemo(() => {
    if (inputToken && order.inputAmount) {
      if (inputToken instanceof Token) {
        return new TokenAmount(inputToken, order.inputAmount)
      }
      return CurrencyAmount.ether(order.inputAmount)
    }
    return undefined
  }, [inputToken, order.inputAmount])

  const rawMinReturn = useMemo(
    () =>
      order.adjustedMinReturn
        ? order.adjustedMinReturn
        : gelatoLibrary && chainId && order.minReturn
        ? gelatoLibrary.getAdjustedMinReturn(order.minReturn)
        : undefined,
    [chainId, gelatoLibrary, order.adjustedMinReturn, order.minReturn],
  )

  const outputAmount = useMemo(() => {
    if (outputToken && rawMinReturn) {
      if (outputToken instanceof Token) {
        return new TokenAmount(outputToken, rawMinReturn)
      }
      return CurrencyAmount.ether(rawMinReturn)
    }
    return undefined
  }, [outputToken, rawMinReturn])
  return (
    <StyledRow>
      <span>
        {inputAmount?.toSignificant(4)} {inputToken?.symbol}
      </span>
      <span>for</span>
      <span>
        {outputAmount?.toSignificant(4)} {outputToken?.symbol}
      </span>
      <span>
        <a href={getBscScanLink(order.createdTxHash, 'transaction')}>See BSCScan</a>
      </span>
    </StyledRow>
  )
}

const OrderHistoryTable = () => {
  const ordersHistory = useGelatoLimitOrdersHistory()

  return (
    <div style={{ width: '50%' }}>
      <h1>Debug</h1>
      <hr />
      <h2>Open</h2>
      <h3>Confirmed</h3>
      {ordersHistory.open.confirmed.map((order) => (
        <Row order={order} />
      ))}
      <h3>Pending</h3>
      {ordersHistory.open.pending.map((order) => (
        <Row order={order} />
      ))}
      <hr />
      <h2>Cancelled</h2>
      <h3>Confirmed</h3>
      {ordersHistory.cancelled.confirmed.map((order) => (
        <Row order={order} />
      ))}
      <h3>Pending</h3>
      {ordersHistory.cancelled.pending.map((order) => (
        <Row order={order} />
      ))}
      <hr />
      <h2>Executed</h2>
      <h3>Confirmed</h3>
      {ordersHistory.executed.map((order) => (
        <Row order={order} />
      ))}
    </div>
  )
}

export default OrderHistoryTable
