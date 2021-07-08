import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { Team } from 'config/constants/types'
import Nfts from 'config/constants/nfts'
import { farmsConfig } from 'config/constants'
import { simpleRpcProvider } from 'utils/providers'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  setBlock,
} from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, AchievementState, FarmsState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchWalletNfts } from './collectibles'
import { getCanClaim } from './predictions/helpers'
import { transformPool } from './pools/helpers'
import { fetchPoolsStakingLimitsAsync } from './pools'
import { fetchFarmUserDataAsync, nonArchivedFarms } from './farms'
import { fetchCurrentLotteryId, fetchCurrentLottery, fetchUserTicketsAndLotteries, fetchPastLotteries } from './lottery'
import { useProcessLotteryResponse } from './lottery/helpers'

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

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

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }

    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return transformPool(pool)
}

export const useFetchCakeVault = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchCakeVaultUserData({ account }))
  }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
}

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.cakeVault)

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString)
  }, [estimatedCakeBountyRewardAsString])

  const totalPendingCakeHarvest = useMemo(() => {
    return new BigNumber(totalPendingCakeHarvestAsString)
  }, [totalPendingCakeHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalCakeInVault = useMemo(() => {
    return new BigNumber(totalCakeInVaultAsString)
  }, [totalCakeInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const cakeAtLastUserAction = useMemo(() => {
    return new BigNumber(cakeAtLastUserActionAsString)
  }, [cakeAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
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
export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetRounds = () => {
  return useSelector((state: State) => state.predictions.rounds)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
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

export const useGetRound = (id: string) => {
  const rounds = useGetRounds()
  return rounds[id]
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
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
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

export const useGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.predictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

export const useBetCanClaim = (account: string, roundId: string) => {
  const bet = useGetBetByRoundId(account, roundId)

  if (!bet) {
    return false
  }

  return getCanClaim(bet)
}

export const useGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
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
    // get current lottery ID, max tickets and historical lottery subgraph data
    dispatch(fetchCurrentLotteryId())
    dispatch(fetchPastLotteries())
  }, [dispatch])

  useEffect(() => {
    // get public data for current lottery
    if (currentLotteryId) {
      dispatch(fetchCurrentLottery({ currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, fastRefresh])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId) {
      dispatch(fetchUserTicketsAndLotteries({ account, lotteryId: currentLotteryId }))
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
