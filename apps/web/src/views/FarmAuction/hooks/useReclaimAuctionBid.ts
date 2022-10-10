import { useEffect, useReducer } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { BidderAuction } from 'config/constants/types'
import { useFarmAuctionContract } from 'hooks/useContract'
import { RECLAIM_AUCTIONS_TO_FETCH } from 'config'
import { processBidderAuctions, sortAuctionBidders } from '../helpers'

interface ReclaimableAuction {
  id: number
  amount: BigNumber
  position: number
}

interface ReclaimReducerState {
  auctions: BidderAuction[]
  currentCursor: number
  nextCursor: number
  nextAuctionToCheck: number // nextAuctionToCheck is array index in auctions
  auctionToReclaim: ReclaimableAuction | null
  loading: boolean
}

const initialState: ReclaimReducerState = {
  auctions: [],
  currentCursor: 0,
  nextCursor: 0,
  nextAuctionToCheck: 0,
  auctionToReclaim: null,
  loading: false,
}

const reclaimReducer = (state: ReclaimReducerState, action: { type: string; payload?: any }): ReclaimReducerState => {
  switch (action.type) {
    case 'setAuctions':
      return {
        auctions: action.payload.auctions,
        currentCursor: state.currentCursor,
        nextCursor: action.payload.nextCursor,
        nextAuctionToCheck: 0,
        auctionToReclaim: null,
        loading: false,
      }
    case 'setAuctionToReclaim':
      return {
        ...state,
        auctionToReclaim: action.payload.auctionToReclaim,
        loading: false,
      }
    case 'checkNextAuction': {
      const nextAuctionToCheck = state.nextAuctionToCheck + 1
      if (nextAuctionToCheck === state.auctions.length) {
        // Checked all auctions in the batch
        return {
          ...state,
          auctions: [],
          currentCursor: state.nextCursor,
          auctionToReclaim: null,
          loading: false,
        }
      }
      return {
        ...state,
        nextAuctionToCheck,
        auctionToReclaim: null,
        loading: false,
      }
    }
    case 'setLoading':
      return { ...state, loading: action.payload.loading }
    case 'reset':
      return initialState
    default:
      return state
  }
}

/**
 * This hook checks if user has participated in previous auctions and has some bids to claim back.
 */
const useReclaimAuctionBid = (): [ReclaimableAuction | null, () => void] => {
  const { account } = useWeb3React()

  const [state, dispatch] = useReducer(reclaimReducer, initialState)

  const farmAuctionContract = useFarmAuctionContract(false)

  const checkNextAuction = () => {
    dispatch({ type: 'checkNextAuction' })
  }

  // Reset checking if account was switched
  useEffect(() => {
    dispatch({ type: 'reset' })
  }, [account])

  // Fetch auction data for auctions account has participated
  useEffect(() => {
    const fetchBidderAuctions = async () => {
      try {
        dispatch({ type: 'setLoading', payload: { loading: true } })

        const bidderAuctionsResponse = await farmAuctionContract.viewBidderAuctions(
          account,
          state.currentCursor,
          RECLAIM_AUCTIONS_TO_FETCH,
        )

        const { auctions, nextCursor } = processBidderAuctions(bidderAuctionsResponse)
        if (auctions.length > 0) {
          dispatch({ type: 'setAuctions', payload: { auctions, nextCursor } })
        }
      } catch (error) {
        console.error('Failed to fetch auctions for bidder', error)
        dispatch({ type: 'setLoading', payload: { loading: false } })
      }
    }

    if (!state.loading && account && state.currentCursor === state.nextCursor) {
      fetchBidderAuctions()
    }
  }, [account, state, farmAuctionContract])

  useEffect(() => {
    const checkIfAuctionIsClaimable = async (auctionToCheck: BidderAuction) => {
      dispatch({ type: 'setLoading', payload: { loading: true } })
      try {
        const isClaimable = await farmAuctionContract.claimable(auctionToCheck.id, account)
        if (isClaimable) {
          const [auctionBidders] = await farmAuctionContract.viewBidsPerAuction(auctionToCheck.id, 0, 500)
          const sortedBidders = sortAuctionBidders(auctionBidders)
          const accountBidderData = sortedBidders.find((bidder) => bidder.account === account)
          const position = accountBidderData?.position
          const auctionToReclaim = { id: auctionToCheck.id, amount: auctionToCheck.amount, position }
          dispatch({ type: 'setAuctionToReclaim', payload: { auctionToReclaim } })
        } else {
          dispatch({ type: 'checkNextAuction' })
        }
      } catch (error) {
        dispatch({ type: 'setLoading', payload: { loading: false } })
        console.error('Failed to check for unclaim bids', error)
      }
    }
    const { auctions, nextAuctionToCheck, loading } = state
    if (auctions.length > 0 && account && !loading) {
      const auctionToCheck = auctions[nextAuctionToCheck]
      checkIfAuctionIsClaimable(auctionToCheck)
    }
  }, [account, state, farmAuctionContract])

  return [state.auctionToReclaim, checkNextAuction]
}

export default useReclaimAuctionBid
