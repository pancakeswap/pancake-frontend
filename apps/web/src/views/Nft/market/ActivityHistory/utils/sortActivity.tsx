import { BigNumber } from '@ethersproject/bignumber'
import { Activity, AskOrder, AskOrderType, MarketEvent, Transaction } from 'state/nftMarket/types'

export const sortActivity = ({
  askOrders = [],
  transactions = [],
}: {
  askOrders?: AskOrder[]
  transactions?: Transaction[]
}): Activity[] => {
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

  const transformTransactions = (transactionsHistory: Transaction[]): Activity[] => {
    const transformedTransactions = transactionsHistory.map((transactionHistory) => {
      const marketEvent = MarketEvent.SELL
      const { timestamp, nft } = transactionHistory
      const price = transactionHistory.askPrice
      const tx = transactionHistory.id
      const buyer = transactionHistory.buyer.id
      const seller = transactionHistory.seller.id
      return { marketEvent, price, timestamp, nft, tx, buyer, seller }
    })

    return transformedTransactions
  }

  const transformAskOrders = (askOrdersHistory: AskOrder[]): Activity[] => {
    const transformedAskOrders = askOrdersHistory.map((askOrderHistory) => {
      const marketEvent = getAskOrderEvent(askOrderHistory.orderType)
      const price = askOrderHistory.askPrice
      const { timestamp, nft } = askOrderHistory
      const tx = askOrderHistory.id
      const seller = askOrderHistory?.seller.id
      return { marketEvent, price, timestamp, nft, tx, seller }
    })

    return transformedAskOrders
  }

  const allActivity = [...transformAskOrders(askOrders), ...transformTransactions(transactions)]
  if (allActivity.length > 0) {
    const sortedByMostRecent = allActivity.sort((activityItem1, activityItem2) => {
      const timestamp1 = BigNumber.from(activityItem1.timestamp)
      const timestamp2 = BigNumber.from(activityItem2.timestamp)
      return timestamp2.sub(timestamp1).toNumber()
    })

    return sortedByMostRecent
  }
  return []
}
