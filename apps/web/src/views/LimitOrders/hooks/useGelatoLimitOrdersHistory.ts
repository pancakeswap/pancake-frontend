import { GelatoLimitOrders, Order } from '@gelatonetwork/limit-orders-lib'
import { SLOW_INTERVAL } from 'config/constants'

import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'
import { getLSOrders, hashOrder, hashOrderSet, saveOrder, saveOrders } from 'utils/localStorageOrders'

import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { usePublicClient } from 'wagmi'
import { Transaction, decodeFunctionData } from 'viem'
import { gelatoLimitABI } from 'config/abi/gelatoLimit'
import { LimitOrderStatus, ORDER_CATEGORY } from '../types'

export const EXISTING_ORDERS_QUERY_KEY = ['limitOrders', 'gelato', 'existingOrders']
export const OPEN_ORDERS_QUERY_KEY = ['limitOrders', 'gelato', 'openOrders']
export const EXECUTED_CANCELLED_ORDERS_QUERY_KEY = ['limitOrders', 'gelato', 'cancelledExecutedOrders']
export const EXECUTED_EXPIRED_ORDERS_QUERY_KEY = ['limitOrders', 'gelato', 'expiredExecutedOrders']

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

const useExistingOrders = (): [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
][] => {
  const { account, chainId } = useAccountActiveChain()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const provider = usePublicClient({ chainId })

  const { data = [] } = useQuery({
    queryKey: [...EXISTING_ORDERS_QUERY_KEY, account],

    queryFn: async () => {
      if (!gelatoLimitOrders || !account || !chainId) {
        throw new Error('Missing gelatoLimitOrders, account or chainId')
      }
      try {
        if (provider) {
          const response = await fetch(
            `/api/query/transaction?sender=${account}&to=${gelatoLimitOrders?.contract.address}`,
          )
          const { hashes }: { hashes: `0x${string}`[] } = await response.json()
          const transactionDetails: Transaction[] = await Promise.all(
            hashes.map((hash) => provider.getTransaction({ hash })),
          )

          const contractData = transactionDetails
            .map((transaction) => {
              if (!transaction.input) return undefined
              const { args } = decodeFunctionData({
                abi: gelatoLimitABI,
                data: transaction.input,
              })
              if (args && args.length > 0) {
                const data_ = args[0] as string
                const offset = data_.startsWith('0x') ? 2 : 0
                const owner = `0x${data_.substr(offset + 64 * 2 + 24, 40)}`
                const module_ = `0x${data_.substr(offset + 64 * 0 + 24, 40)}`
                const inputToken = `0x${data_.substr(offset + 64 * 1 + 24, 40)}`
                const witness = `0x${data_.substr(offset + 64 * 3 + 24, 40)}`
                return [
                  transaction.hash,
                  module_,
                  inputToken,
                  owner,
                  witness,
                  `0x${data_.substr(offset + 64 * 7, 64 * 3)}`,
                ]
              }
              return undefined
            })
            .filter(Boolean) as [
            `0x${string}`,
            `0x${string}`,
            `0x${string}`,
            `0x${string}`,
            `0x${string}`,
            `0x${string}`,
          ][]

          const existRoles = await provider.multicall({
            contracts: contractData.map(([, ...args]) => {
              return {
                abi: gelatoLimitABI,
                address: gelatoLimitOrders.contract.address,
                functionName: 'existOrder',
                args,
              }
            }) as any[],
            allowFailure: false,
          })
          return contractData.filter((_, index) => existRoles[index])
        }
      } catch (e) {
        console.error('Error fetching open orders from subgraph', e)
      }
      return undefined
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return data
}

const useOpenOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data = [] } = useQuery({
    queryKey: OPEN_ORDERS_QUERY_KEY,

    queryFn: async () => {
      if (!gelatoLimitOrders || !account || !chainId) {
        throw new Error('Missing gelatoLimitOrders, account or chainId')
      }
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), true)

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

    enabled: Boolean(startFetch),
    refetchInterval: SLOW_INTERVAL,
  })

  return startFetch ? data : []
}

const useHistoryOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data = [] } = useQuery({
    queryKey: EXECUTED_CANCELLED_ORDERS_QUERY_KEY,

    queryFn: async () => {
      if (!gelatoLimitOrders || !account || !chainId) {
        throw new Error('Missing gelatoLimitOrders, account or chainId')
      }
      try {
        const acc = account.toLowerCase()

        const [canOrders, exeOrders] = await Promise.all([
          gelatoLimitOrders.getCancelledOrders(acc, true),
          gelatoLimitOrders.getExecutedOrders(acc, true),
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

    enabled: Boolean(startFetch),
    refetchInterval: SLOW_INTERVAL,
  })

  return startFetch ? data : []
}

const useExpiredOrders = (turnOn: boolean): Order[] => {
  const { account, chainId } = useAccountActiveChain()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const startFetch = turnOn && gelatoLimitOrders && account && chainId

  const { data = [] } = useQuery({
    queryKey: EXECUTED_EXPIRED_ORDERS_QUERY_KEY,

    queryFn: async () => {
      if (!gelatoLimitOrders || !account || !chainId) {
        throw new Error('Missing gelatoLimitOrders, account or chainId')
      }
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), true)
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

    enabled: Boolean(startFetch),
    refetchInterval: SLOW_INTERVAL,
  })

  return startFetch ? data : []
}

export default function useGelatoLimitOrdersHistory(orderCategory: ORDER_CATEGORY) {
  // const historyOrders = useHistoryOrders(orderCategory === ORDER_CATEGORY.History)
  // const openOrders = useOpenOrders(orderCategory === ORDER_CATEGORY.Open)
  // const expiredOrders = useExpiredOrders(orderCategory === ORDER_CATEGORY.Expired)

  // const orders = useMemo(() => {
  //   switch (orderCategory as ORDER_CATEGORY) {
  //     case ORDER_CATEGORY.Open:
  //       return openOrders
  //     case ORDER_CATEGORY.History:
  //       return historyOrders
  //     case ORDER_CATEGORY.Expired:
  //       return expiredOrders
  //     default:
  //       return []
  //   }
  // }, [orderCategory, openOrders, historyOrders, expiredOrders])

  return useExistingOrders()

  // return useMemo(
  //   () => (Array.isArray(orders) ? orderBy(orders, (order) => parseInt(order.createdAt), 'desc') : orders),
  //   [orders],
  // )
}
