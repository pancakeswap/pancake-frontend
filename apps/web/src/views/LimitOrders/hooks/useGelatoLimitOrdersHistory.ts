import { Order, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'

import { getLSOrders, saveOrder, saveOrders, hashOrderSet, hashOrder } from 'utils/localStorageOrders'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'

import orderBy from 'lodash/orderBy'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { ORDER_CATEGORY, LimitOrderStatus } from '../types'

export const OPEN_ORDERS_SWR_KEY = ['gelato', 'openOrders']
export const EXECUTED_CANCELLED_ORDERS_SWR_KEY = ['gelato', 'cancelledExecutedOrders']
export const EXECUTED_EXPIRED_ORDERS_SWR_KEY = ['gelato', 'expiredExecutedOrders']

function newOrdersFirst(a: Order, b: Order) {
  return Number(b.updatedAt) - Number(a.updatedAt)
}

const isOrderUpdated = (oldOrder: Order, newOrder: Order): boolean => {
  return newOrder ? Number(oldOrder.updatedAt) < Number(newOrder.updatedAt) : false
}

async function syncOrderToLocalStorage({
  gelatoLimitOrders,
  chainId,
  account,
  orders,
  syncStatuses,
}: {
  chainId: number
  account: string
  orders: Order[]
  syncStatuses?: LimitOrderStatus[]
  gelatoLimitOrders?: GelatoLimitOrders
}) {
  const allOrdersLS = getLSOrders(chainId, account)

  const lsOrdersHashSet = hashOrderSet(allOrdersLS)
  const newOrders = orders.filter((order: Order) => !lsOrdersHashSet.has(hashOrder(order)))
  saveOrders(chainId, account, newOrders)

  const typeOrdersLS = syncStatuses
    ? allOrdersLS.filter((order) => syncStatuses.some((type) => type === order.status))
    : []

  const results = await Promise.all(
    typeOrdersLS.map((confOrder) => {
      const orderFetched = orders.find((order) => confOrder.id.toLowerCase() === order.id.toLowerCase())
      return !orderFetched
        ? gelatoLimitOrders
          ? Promise.allSettled([Promise.resolve(confOrder), gelatoLimitOrders.getOrder(confOrder.id)])
          : Promise.resolve([confOrder, null])
        : Promise.resolve([confOrder, orderFetched])
    }),
  )

  results.forEach((result) => {
    const [confOrderPromiseResult, graphOrderPromiseResult] = result as PromiseSettledResult<Order>[]
    if (confOrderPromiseResult.status === 'fulfilled' && graphOrderPromiseResult.status === 'fulfilled') {
      if (isOrderUpdated(confOrderPromiseResult.value, graphOrderPromiseResult.value)) {
        saveOrder(chainId, account, graphOrderPromiseResult.value)
      }
    }
    if (graphOrderPromiseResult.status === 'rejected') {
      console.error('Error fetching order from subgraph', graphOrderPromiseResult.reason)
    }
  })
}

const useOpenOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data } = useSWR(
    startFetch ? OPEN_ORDERS_SWR_KEY : null,
    async () => {
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), false)

        await syncOrderToLocalStorage({
          orders,
          chainId,
          account,
          syncStatuses: [LimitOrderStatus.OPEN],
          gelatoLimitOrders,
        })
      } catch (e) {
        console.error('Error fetching open orders from subgraph', e)
      }

      const openOrdersLS = getLSOrders(chainId, account).filter(
        (order) => order.status === LimitOrderStatus.OPEN && !order.isExpired,
      )

      const pendingOrdersLS = getLSOrders(chainId, account, true)

      return [
        ...openOrdersLS.filter((order: Order) => {
          const orderCancelled = pendingOrdersLS
            .filter((pendingOrder) => pendingOrder.status === LimitOrderStatus.CANCELLED)
            .find((pendingOrder) => pendingOrder.id.toLowerCase() === order.id.toLowerCase())
          return !orderCancelled
        }),
        ...pendingOrdersLS.filter((order) => order.status === LimitOrderStatus.OPEN),
      ].sort(newOrdersFirst)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return startFetch ? data : []
}

const useHistoryOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data } = useSWR(
    startFetch ? EXECUTED_CANCELLED_ORDERS_SWR_KEY : null,
    async () => {
      try {
        const acc = account.toLowerCase()

        const [canOrders, exeOrders] = await Promise.all([
          gelatoLimitOrders.getCancelledOrders(acc, false),
          gelatoLimitOrders.getExecutedOrders(acc, false),
        ])

        await syncOrderToLocalStorage({
          orders: [...canOrders, ...exeOrders],
          chainId,
          account,
        })
      } catch (e) {
        console.error('Error fetching history orders from subgraph', e)
      }

      const executedOrdersLS = getLSOrders(chainId, account).filter(
        (order) => order.status === LimitOrderStatus.EXECUTED,
      )

      const cancelledOrdersLS = getLSOrders(chainId, account).filter(
        (order) => order.status === LimitOrderStatus.CANCELLED,
      )

      const pendingCancelledOrdersLS = getLSOrders(chainId, account, true).filter(
        (order) => order.status === LimitOrderStatus.CANCELLED,
      )

      return [...pendingCancelledOrdersLS, ...cancelledOrdersLS, ...executedOrdersLS].sort(newOrdersFirst)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return startFetch ? data : []
}

const useExpiredOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data } = useSWR(
    startFetch ? EXECUTED_EXPIRED_ORDERS_SWR_KEY : null,
    async () => {
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), false)
        await syncOrderToLocalStorage({
          orders,
          chainId,
          account,
        })
      } catch (e) {
        console.error('Error fetching expired orders from subgraph', e)
      }

      const expiredOrdersLS = getLSOrders(chainId, account).filter(
        (order) => order.isExpired && order.status === LimitOrderStatus.OPEN,
      )

      return expiredOrdersLS.sort(newOrdersFirst)
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
  const expiredOrders = useExpiredOrders(orderCategory === ORDER_CATEGORY.Expired)

  const orders = useMemo(() => {
    switch (orderCategory as ORDER_CATEGORY) {
      case ORDER_CATEGORY.Open:
        return openOrders
      case ORDER_CATEGORY.History:
        return historyOrders
      case ORDER_CATEGORY.Expired:
        return expiredOrders
      default:
        return []
    }
  }, [orderCategory, openOrders, historyOrders, expiredOrders])

  return useMemo(
    () => (Array.isArray(orders) ? orderBy(orders, (order) => parseInt(order.createdAt), 'desc') : orders),
    [orders],
  )
}
