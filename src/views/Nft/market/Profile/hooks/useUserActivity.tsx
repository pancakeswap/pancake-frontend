import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useUserNfts } from 'state/nftMarket/hooks'
import { AskOrder, AskOrderType, TokenMarketData, Transaction, UserNftInitializationState } from 'state/nftMarket/types'

export enum MarketEvent {
  NEW = 'NEW',
  CANCEL = 'CANCEL',
  MODIFY = 'MODIFY',
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Activity {
  marketEvent: MarketEvent
  timestamp: string
  tx: string
  nft?: TokenMarketData
  price?: string
  otherParty?: string
}

/**
 * Return an array of all user activity, sorted by most recent timestamp.
 * @returns
 */
const useUserActivity = (
  account: string,
): { sortedUserActivites: Activity[]; initializationState: UserNftInitializationState } => {
  const [sortedUserActivites, setSortedUserActivities] = useState<Activity[]>([])
  const {
    activity: { askOrderHistory, buyTradeHistory, sellTradeHistory, initializationState },
  } = useUserNfts()

  useEffect(() => {
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
      const sortedByMostRecent = allActivity.sort((activityItem1, activityItem2) => {
        const timestamp1 = ethers.BigNumber.from(activityItem1.timestamp)
        const timestamp2 = ethers.BigNumber.from(activityItem2.timestamp)
        return timestamp2.sub(timestamp1).toNumber()
      })

      setSortedUserActivities(sortedByMostRecent)
    }

    return () => {
      setSortedUserActivities([])
    }
  }, [account, askOrderHistory, buyTradeHistory, sellTradeHistory])

  return { sortedUserActivites, initializationState }
}

export default useUserActivity
