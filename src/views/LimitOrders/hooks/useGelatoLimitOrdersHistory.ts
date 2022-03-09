import { Order } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'

import { getLSOrders, saveOrder, removeOrder, saveOrders } from 'utils/localStorageOrders'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'

import { ORDER_CATEGORY } from '../types'

function newOrdersFirst(a: Order, b: Order) {
  return Number(b.updatedAt) - Number(a.updatedAt)
}

function syncOrderToLocalStorage({ chainId, account, orders }: { chainId: number; account: string; orders: Order[] }) {
  const ordersLS = getLSOrders(chainId, account)

  const newOrders = orders.filter(
    (order: Order) => !ordersLS.some((confOrder) => confOrder.id.toLowerCase() === order.id.toLowerCase()),
  )
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
        })
      } catch (e) {
        console.error('Error fetching open orders from subgraph', e)
      }

      const openOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'open')

      const pendingOrdersLS = getLSOrders(chainId, account, true)

      return [
        ...openOrdersLS.filter((order: Order) => {
          const orderCancelled = pendingOrdersLS
            .filter((pendingOrder) => pendingOrder.status === 'cancelled')
            .find((pendingOrder) => pendingOrder.id.toLowerCase() === order.id.toLowerCase())
          return !orderCancelled
        }),
        ...pendingOrdersLS.filter((order) => order.status === 'open'),
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
        })
      } catch (e) {
        console.error('Error fetching history orders from subgraph', e)
      }

      const executedOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'executed')

      const cancelledOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'cancelled')

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
