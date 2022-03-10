import { Order } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'

import { getLSOrders, saveOrder, removeOrder, saveOrders, hashOrderSet, hashOrder } from 'utils/localStorageOrders'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'

import { ORDER_CATEGORY, LimitOrderType } from '../types'

function newOrdersFirst(a: Order, b: Order) {
  return Number(b.updatedAt) - Number(a.updatedAt)
}

function syncOrderToLocalStorage({
  chainId,
  account,
  orders,
  types,
}: {
  chainId: number
  account: string
  orders: Order[]
  types: LimitOrderType[]
}) {
  const ordersLS = getLSOrders(chainId, account).filter((order) => types.some((type) => type === order.status))

  const ordersLSHashSet = hashOrderSet(ordersLS)
  const newOrders = orders.filter((order: Order) => !ordersLSHashSet.has(hashOrder(order)))
  saveOrders(chainId, account, newOrders)

  ordersLS.forEach((confOrder: Order) => {
    const updatedOrder = orders.find((order) => confOrder.id.toLowerCase() === order.id.toLowerCase())

    if (updatedOrder && Number(confOrder.updatedAt) < Number(updatedOrder.updatedAt)) {
      saveOrder(chainId, account, updatedOrder)
    } else if (!updatedOrder) {
      removeOrder(chainId, account, confOrder)
    }
  })
}

const useOpenOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useActiveWeb3React()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data } = useSWR(
    startFetch ? ['gelato', 'openOrders'] : null,
    async () => {
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), false)

        syncOrderToLocalStorage({
          orders,
          chainId,
          account,
          types: [LimitOrderType.OPEN],
        })
      } catch (e) {
        console.error('Error fetching open orders from subgraph', e)
      }

      const openOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === LimitOrderType.OPEN)

      const pendingOrdersLS = getLSOrders(chainId, account, true)

      return [
        ...openOrdersLS.filter((order: Order) => {
          const orderCancelled = pendingOrdersLS
            .filter((pendingOrder) => pendingOrder.status === LimitOrderType.CANCELLED)
            .find((pendingOrder) => pendingOrder.id.toLowerCase() === order.id.toLowerCase())
          return !orderCancelled
        }),
        ...pendingOrdersLS.filter((order) => order.status === LimitOrderType.OPEN),
      ].sort(newOrdersFirst)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return startFetch ? data : []
}

const useHistoryOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useActiveWeb3React()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data } = useSWR(
    startFetch ? ['gelato', 'cancelledExecutedOrders'] : null,
    async () => {
      try {
        const acc = account.toLowerCase()

        const [canOrders, exeOrders] = await Promise.all([
          gelatoLimitOrders.getCancelledOrders(acc, false),
          gelatoLimitOrders.getExecutedOrders(acc, false),
        ])

        syncOrderToLocalStorage({
          orders: [...canOrders, ...exeOrders],
          chainId,
          account,
          types: [LimitOrderType.CANCELLED, LimitOrderType.EXECUTED],
        })
      } catch (e) {
        console.error('Error fetching history orders from subgraph', e)
      }

      const executedOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === LimitOrderType.EXECUTED)

      const cancelledOrdersLS = getLSOrders(chainId, account).filter(
        (order) => order.status === LimitOrderType.CANCELLED,
      )

      const pendingCancelledOrdersLS = getLSOrders(chainId, account, true).filter(
        (order) => order.status === 'cancelled',
      )

      return [...pendingCancelledOrdersLS, ...cancelledOrdersLS, ...executedOrdersLS].sort(newOrdersFirst)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return startFetch ? data : []
}

export default function useGelatoLimitOrdersHistory(orderCategory: ORDER_CATEGORY) {
  const historyOrders = useHistoryOrders(orderCategory === ORDER_CATEGORY.History)
  const openOrders = useOpenOrders(orderCategory === ORDER_CATEGORY.Open)

  const orders = useMemo(
    () => (orderCategory === ORDER_CATEGORY.Open ? openOrders : historyOrders),
    [orderCategory, openOrders, historyOrders],
  )

  return useMemo(
    () =>
      Array.isArray(orders) ? orders.sort((a, b) => parseInt(b.createdAt, 10) - parseInt(a.createdAt, 10)) : orders,
    [orders],
  )
}
