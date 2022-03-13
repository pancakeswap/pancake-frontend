import { Order } from '@gelatonetwork/limit-orders-lib'
import { get, set, clear } from 'local-storage'

export const LS_ORDERS = 'gorders_'

export const hashOrder = (order: Order) => order.id

export const hashOrderSet = (orders: Order[]) => new Set(orders.map(hashOrder))

export function clearOrdersLocalStorage() {
  return clear()
}

export function lsKey(key: string, account: string, chainId: number) {
  return key + account.toString() + chainId.toString()
}

export function getLSOrders(chainId: number, account: string, pending = false) {
  const key = pending ? lsKey(`${LS_ORDERS}pending_`, account, chainId) : lsKey(LS_ORDERS, account, chainId)

  const orders = get<Order[]>(key)

  return orders ? getUniqueOrders(orders) : []
}

export function saveOrder(chainId: number, account: string, order: Order, pending = false) {
  saveOrders(chainId, account, [order], pending)
}

export function saveOrders(chainId: number, account: string, orders: Order[], pending = false) {
  if (!orders || !orders.length) return

  const key = pending ? lsKey(`${LS_ORDERS}pending_`, account, chainId) : lsKey(LS_ORDERS, account, chainId)

  if (!pending) {
    removeOrders(chainId, account, orders, true)
  }

  const result = removeOrders(chainId, account, orders, pending)

  if (!result.length) {
    set(key, orders)
  } else {
    result.push(...orders)
    set(key, result)
  }
}

export function removeOrders(chainId: number, account: string, orders: Order[], pending = false) {
  const key = pending ? lsKey(`${LS_ORDERS}pending_`, account, chainId) : lsKey(LS_ORDERS, account, chainId)

  const prev = get<Order[]>(key)

  if (!prev) return []

  if (!orders || !orders.length) return prev

  const orderHashSet = hashOrderSet(orders)
  const result = prev.filter((orderInLS: Order) => !orderHashSet.has(hashOrder(orderInLS)))

  set(key, result)

  return result
}

export function removeOrder(chainId: number, account: string, order: Order, pending = false) {
  return removeOrders(chainId, account, [order], pending)
}

export function confirmOrderCancellation(chainId: number, account: string, cancellationHash: string, success = true) {
  const cancelHash = cancellationHash.toLowerCase()
  const pendingKey = lsKey(`${LS_ORDERS}pending_`, account, chainId)
  const pendingOrders = get<Order[]>(pendingKey)
  const confirmedOrder = pendingOrders.find((order) => order.cancelledTxHash?.toLowerCase() === cancelHash)

  if (confirmedOrder) removeOrder(chainId, account, confirmedOrder, true)

  if (success && confirmedOrder) {
    const ordersKey = lsKey(LS_ORDERS, account, chainId)
    const orders = get<Order[]>(ordersKey)
    if (orders) {
      const ordersToSave = removeOrder(chainId, account, confirmedOrder)
      ordersToSave.push({
        ...confirmedOrder,
        cancelledTxHash: cancelHash,
      })
      set(ordersKey, ordersToSave)
    } else {
      set(ordersKey, [
        {
          ...confirmedOrder,
          cancelledTxHash: cancelHash,
        },
      ])
    }
  }
}

export function confirmOrderSubmission(chainId: number, account: string, submissionHash: string, success = true) {
  const creationHash = submissionHash.toLowerCase()
  const pendingKey = lsKey(`${LS_ORDERS}pending_`, account, chainId)
  const pendingOrders = get<Order[]>(pendingKey)
  const confirmedOrder = pendingOrders.find((order) => order.createdTxHash?.toLowerCase() === creationHash)

  if (confirmedOrder) removeOrder(chainId, account, confirmedOrder, true)

  if (success && confirmedOrder) {
    const ordersKey = lsKey(LS_ORDERS, account, chainId)
    const orders = get<Order[]>(ordersKey)
    if (orders) {
      const ordersToSave = removeOrder(chainId, account, {
        ...confirmedOrder,
        createdTxHash: creationHash,
      })
      ordersToSave.push({
        ...confirmedOrder,
        createdTxHash: creationHash,
      })
      set(ordersKey, ordersToSave)
    } else {
      set(ordersKey, [
        {
          ...confirmedOrder,
          createdTxHash: creationHash,
        },
      ])
    }
  }
}

export const getUniqueOrders = (allOrders: Order[]): Order[] => [
  ...new Map(
    allOrders
      // sort by `updatedAt` asc so that the most recent one will be used
      .sort((a, b) => parseFloat(a.updatedAt) - parseFloat(b.updatedAt))
      .map((order) => [order.id, order]),
  ).values(),
]
