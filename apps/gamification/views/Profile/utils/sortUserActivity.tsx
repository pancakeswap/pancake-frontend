import { Activity, AskOrder, AskOrderType, MarketEvent, Transaction, UserActivity } from 'hooks/useProfile/nft/types'
import orderBy from 'lodash/orderBy'

export const sortUserActivity = (account: string, userActivity: UserActivity): Activity[] => {
  const { askOrderHistory, buyTradeHistory, sellTradeHistory } = userActivity

  const getAskOrderEvent = (orderType: AskOrderType): MarketEvent => {
    switch (orderType) {
      case AskOrderType.CANCEL:
        return MarketEvent.CANCEL
      case AskOrderType.MODIFY:
        return MarketEvent.MODIFY
      case AskOrderType.NEW:
        return MarketEvent.NEW
      default:
        return MarketEvent.MODIFY
    }
  }

  const transformTransactions = (transactions: Transaction[]): Activity[] => {
    const transformedTransactions = transactions.map((transaction) => {
      const userSeller = transaction.seller.id === account.toLowerCase()
      const marketEvent = userSeller ? MarketEvent.SELL : MarketEvent.BUY
      const { timestamp, nft } = transaction
      const price = transaction.askPrice
      const otherParty = userSeller ? transaction.buyer.id : transaction.seller.id
      const tx = transaction.id
      return { marketEvent, price, otherParty, timestamp, nft, tx }
    })

    return transformedTransactions
  }

  const transformAskOrders = (askOrders: AskOrder[]): Activity[] => {
    const transformedAskOrders = askOrders.map((askOrder) => {
      const marketEvent = getAskOrderEvent(askOrder.orderType)
      const { timestamp, nft } = askOrder
      const price = askOrder.askPrice
      const tx = askOrder.id
      return { marketEvent, price, timestamp, nft, tx }
    })

    return transformedAskOrders
  }

  const allActivity = [
    ...transformAskOrders(askOrderHistory),
    ...transformTransactions(buyTradeHistory),
    ...transformTransactions(sellTradeHistory),
  ]
  if (allActivity.length > 0) {
    const sortedByMostRecent = orderBy(allActivity, (activity) => parseInt(activity.timestamp, 10), 'desc')

    return sortedByMostRecent
  }
  return []
}
