import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useUserNfts } from 'state/nftMarket/hooks'
import { AskOrder, Transaction } from 'state/nftMarket/types'

/**
 * Return an array of all user activity, sorted by most recent timestamp and paginated using cursor/first.
 * @param cursor Index to start slicing the data
 * @param first Index to finish slicing the data
 * @returns
 */
const useUserActivity = (): (Transaction | AskOrder)[] => {
  const userNftState = useUserNfts()
  const [sortedUserActivites, setSortedUserActivities] = useState([])
  const {
    activity: { askOrderHistory, buyTradeHistory, sellTradeHistory },
  } = userNftState

  useEffect(() => {
    const allActivity = [...askOrderHistory, ...buyTradeHistory, ...sellTradeHistory]
    if (allActivity.length > 0) {
      const sortedByMostRecent = allActivity.sort((activityItem1, activityItem2) => {
        const timestamp1 = ethers.BigNumber.from(activityItem1.timestamp)
        const timestamp2 = ethers.BigNumber.from(activityItem2.timestamp)
        return timestamp2.sub(timestamp1).toNumber()
      })

      setSortedUserActivities(sortedByMostRecent)
    }
  }, [askOrderHistory, buyTradeHistory, sellTradeHistory])

  // TODO: This return is an array of different types (AskOrders & Transactions)
  // Once the UI requirements are clearer - there could be data transformation of these to return data of one type
  return sortedUserActivites
}

export default useUserActivity
