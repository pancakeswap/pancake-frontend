import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { minBy, orderBy } from 'lodash'
import { useAppDispatch } from 'state'
import { Team } from 'config/constants/types'
import Nfts from 'config/constants/nfts'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from 'hooks/useRefresh'
import { setBlock } from './actions'
import {
  State,
  ProfileState,
  TeamsState,
  AchievementState,
  NodeRound,
  ReduxNodeLedger,
  NodeLedger,
  ReduxNodeRound,
} from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchWalletNfts } from './collectibles'
import { parseBigNumberObj } from './predictions/helpers'
import {
  fetchCurrentLotteryId,
  fetchCurrentLottery,
  fetchUserTicketsAndLotteries,
  fetchPublicLotteries,
} from './lottery'
import { useProcessLotteryResponse } from './lottery/helpers'
import { useFarmFromPid } from './farms/hooks'

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(252)
  return new BigNumber(bnbBusdFarm.quoteToken.busdPrice)
}

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(251)
  return new BigNumber(cakeBnbFarm.token.busdPrice)
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Predictions
export const useGetRounds = () => {
  const rounds = useSelector((state: State) => state.predictions.rounds)
  return Object.keys(rounds).reduce((accum, epoch) => {
    return {
      ...accum,
      [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
    }
  }, {}) as { [key: string]: NodeRound }
}

export const useGetRound = (epoch: number) => {
  const round = useSelector((state: State) => state.predictions.rounds[epoch])
  return parseBigNumberObj<ReduxNodeRound, NodeRound>(round)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
  const bets = useSelector((state: State) => state.predictions.ledgers)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][epoch]) {
    return null
  }

  return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
}

export const useGetIsClaimable = (epoch) => {
  const claimableStatuses = useSelector((state: State) => state.predictions.claimableStatuses)
  return claimableStatuses[epoch] || false
}

/**
 * Used to get the range of rounds to poll for
 */
export const useGetEarliestEpoch = () => {
  return useSelector((state: State) => {
    const earliestRound = minBy(Object.values(state.predictions.rounds), 'epoch')
    return earliestRound?.epoch
  })
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks)
}

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks)
}

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks()
  const bufferBlocks = useGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
  return useMemo(() => ethers.BigNumber.from(minBetAmount), [minBetAmount])
}

export const useGetRewardRate = () => {
  const rewardRate = useSelector((state: State) => state.predictions.rewardRate)
  return rewardRate / 100
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory()
  return bets ? bets[account] : []
}

export const useGetLedgerByRoundId = (account: string, roundId: string) => {
  const ledgers = useSelector((state: State) => state.predictions.ledgers)

  if (!ledgers[account]) {
    return null
  }

  if (!ledgers[account][roundId]) {
    return null
  }

  return ledgers[account][roundId]
}

export const useGetLastOraclePrice = () => {
  const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
  return useMemo(() => {
    return ethers.BigNumber.from(lastOraclePrice)
  }, [lastOraclePrice])
}

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}

// Voting
export const useGetProposals = () => {
  const proposals = useSelector((state: State) => state.voting.proposals)
  return Object.values(proposals)
}

export const useGetProposal = (proposalId: string) => {
  const proposal = useSelector((state: State) => state.voting.proposals[proposalId])
  return proposal
}

export const useGetVotes = (proposalId: string) => {
  const votes = useSelector((state: State) => state.voting.votes[proposalId])
  return votes ? votes.filter((vote) => vote._inValid !== true) : []
}

export const useGetVotingStateLoadingStatus = () => {
  const votingStatus = useSelector((state: State) => state.voting.voteLoadingStatus)
  return votingStatus
}

export const useGetProposalLoadingStatus = () => {
  const votingStatus = useSelector((state: State) => state.voting.proposalLoadingStatus)
  return votingStatus
}

// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetUserLotteryGraphRoundById = (lotteryId: string) => {
  const userLotteriesData = useGetUserLotteriesGraphData()
  return userLotteriesData.rounds.find((userRound) => userRound.lotteryId === lotteryId)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteriesData = useGetLotteriesGraphData()
  return lotteriesData.find((lottery) => lottery.id === lotteryId)
}

export const useFetchLottery = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()

  useEffect(() => {
    // get current lottery ID & max ticket buy
    dispatch(fetchCurrentLotteryId())
  }, [dispatch])

  useEffect(() => {
    if (currentLotteryId) {
      // Get historical lottery data from nodes + subgraph
      dispatch(fetchPublicLotteries({ currentLotteryId }))
      // get public data for current lottery
      dispatch(fetchCurrentLottery({ currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, fastRefresh])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId) {
      dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, account])
}

export const useLottery = () => {
  const currentRound = useSelector((state: State) => state.lottery.currentRound)
  const processedCurrentRound = useProcessLotteryResponse(currentRound)

  const isTransitioning = useSelector((state: State) => state.lottery.isTransitioning)

  const currentLotteryId = useGetCurrentLotteryId()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteriesData = useGetLotteriesGraphData()

  const maxNumberTicketsPerBuyOrClaimAsString = useSelector(
    (state: State) => state.lottery.maxNumberTicketsPerBuyOrClaim,
  )
  const maxNumberTicketsPerBuyOrClaim = useMemo(() => {
    return new BigNumber(maxNumberTicketsPerBuyOrClaimAsString)
  }, [maxNumberTicketsPerBuyOrClaimAsString])

  return {
    currentLotteryId,
    maxNumberTicketsPerBuyOrClaim,
    isTransitioning,
    userLotteryData,
    lotteriesData,
    currentRound: processedCurrentRound,
  }
}
