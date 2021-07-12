import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { CampaignType, FarmConfig, LotteryStatus, LotteryTicket, Nft, PoolConfig, Team } from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }

export type SerializedBigNumber = string

export interface Farm extends FarmConfig {
  tokenAmountMc?: SerializedBigNumber
  quoteTokenAmountMc?: SerializedBigNumber
  tokenAmountTotal?: SerializedBigNumber
  quoteTokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  userData?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  startBlock?: number
  endBlock?: number
  apr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  isAutoVault?: boolean
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft?: Nft
  team: Team
  hasRegistered: boolean
}

// Slices states

export interface FarmsState {
  data: Farm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface VaultFees {
  performanceFee: number
  callFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface VaultUser {
  isLoading: boolean
  userShares: string
  cakeAtLastUserAction: string
  lastDepositedTime: string
  lastUserActionTime: string
}
export interface CakeVault {
  totalShares?: string
  pricePerFullShare?: string
  totalCakeInVault?: string
  estimatedCakeBountyReward?: string
  totalPendingCakeHarvest?: string
  fees?: VaultFees
  userData?: VaultUser
}

export interface PoolsState {
  data: Pool[]
  cakeVault: CakeVault
  userDataLoaded: boolean
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

export interface TeamsState {
  isInitialized: boolean
  isLoading: boolean
  data: TeamsById
}

export interface Achievement {
  id: string
  type: CampaignType
  address: string
  title: TranslatableText
  description?: TranslatableText
  badge: string
  points: number
}

export interface AchievementState {
  data: Achievement[]
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// Collectibles

export interface CollectiblesState {
  isInitialized: boolean
  isLoading: boolean
  data: {
    [key: string]: number[]
  }
}

// Predictions

export enum BetPosition {
  BULL = 'Bull',
  BEAR = 'Bear',
  HOUSE = 'House',
}

export enum PredictionStatus {
  INITIAL = 'initial',
  LIVE = 'live',
  PAUSED = 'paused',
  ERROR = 'error',
}

export interface Round {
  id: string
  epoch: number
  failed?: boolean
  startBlock: number
  startAt: number
  lockAt: number
  lockBlock: number
  lockPrice: number
  endBlock: number
  closePrice: number
  totalBets: number
  totalAmount: number
  bullBets: number
  bearBets: number
  bearAmount: number
  bullAmount: number
  position: BetPosition
  bets?: Bet[]
}

export interface Market {
  paused: boolean
  epoch: number
}

export interface Bet {
  id?: string
  hash?: string
  amount: number
  position: BetPosition
  claimed: boolean
  claimedHash: string
  user?: PredictionUser
  round: Round
}

export interface PredictionUser {
  id: string
  address: string
  block: number
  totalBets: number
  totalBNB: number
}

export interface HistoryData {
  [key: string]: Bet[]
}

export enum HistoryFilter {
  ALL = 'all',
  COLLECTED = 'collected',
  UNCOLLECTED = 'uncollected',
}

export interface LedgerData {
  [key: string]: {
    [key: string]: ReduxNodeLedger
  }
}

export interface RoundData {
  [key: string]: ReduxNodeRound
}

export interface ReduxNodeLedger {
  position: BetPosition
  amount: BigNumberToJson
  claimed: boolean
}

export interface NodeLedger {
  position: BetPosition
  amount: ethers.BigNumber
  claimed: boolean
}

export interface ReduxNodeRound {
  epoch: number
  startBlock: number
  lockBlock: number | null
  endBlock: number | null
  lockPrice: BigNumberToJson | null
  closePrice: BigNumberToJson | null
  totalAmount: BigNumberToJson
  bullAmount: BigNumberToJson
  bearAmount: BigNumberToJson
  rewardBaseCalAmount: BigNumberToJson
  rewardAmount: BigNumberToJson
  oracleCalled: boolean
}

export interface NodeRound {
  epoch: number
  startBlock: number
  lockBlock: number
  endBlock: number
  lockPrice: ethers.BigNumber
  closePrice: ethers.BigNumber
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  oracleCalled: boolean
}

export interface PredictionsState {
  status: PredictionStatus
  isLoading: boolean
  isHistoryPaneOpen: boolean
  isChartPaneOpen: boolean
  isFetchingHistory: boolean
  historyFilter: HistoryFilter
  currentEpoch: number
  currentRoundStartBlockNumber: number
  intervalBlocks: number
  bufferBlocks: number
  minBetAmount: string
  rewardRate: number
  lastOraclePrice: string
  history: HistoryData
  rounds?: RoundData
  ledgers?: LedgerData
  claimableStatuses: {
    [key: string]: boolean
  }
}

// Voting

/* eslint-disable camelcase */
/**
 * @see https://hub.snapshot.page/graphql
 */
export interface VoteWhere {
  id?: string
  id_in?: string[]
  voter?: string
  voter_in?: string[]
  proposal?: string
  proposal_in?: string[]
}

export enum SnapshotCommand {
  PROPOSAL = 'proposal',
  VOTE = 'vote',
}

export enum ProposalType {
  ALL = 'all',
  CORE = 'core',
  COMMUNITY = 'community',
}

export enum ProposalState {
  ACTIVE = 'active',
  PENDING = 'pending',
  CLOSED = 'closed',
}

export interface Space {
  id: string
  name: string
}

export interface Proposal {
  author: string
  body: string
  choices: string[]
  end: number
  id: string
  snapshot: string
  space: Space
  start: number
  state: ProposalState
  title: string
}

export interface Vote {
  id: string
  voter: string
  created: number
  space: Space
  proposal: {
    choices: Proposal['choices']
  }
  choice: number
  metadata?: {
    votingPower: string
    verificationHash: string
  }
  _inValid?: boolean
}

export enum VotingStateLoadingStatus {
  INITIAL = 'initial',
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

export interface VotingState {
  proposalLoadingStatus: VotingStateLoadingStatus
  proposals: {
    [key: string]: Proposal
  }
  voteLoadingStatus: VotingStateLoadingStatus
  votes: {
    [key: string]: Vote[]
  }
}

export interface LotteryRoundUserTickets {
  isLoading?: boolean
  tickets?: LotteryTicket[]
}

interface LotteryRoundGenerics {
  isLoading?: boolean
  lotteryId: string
  status: LotteryStatus
  startTime: string
  endTime: string
  treasuryFee: string
  firstTicketId: string
  lastTicketId: string
  finalNumber: number
}

export interface LotteryRound extends LotteryRoundGenerics {
  userTickets?: LotteryRoundUserTickets
  priceTicketInCake: BigNumber
  discountDivisor: BigNumber
  amountCollectedInCake: BigNumber
  cakePerBracket: string[]
  countWinnersPerBracket: string[]
  rewardsBreakdown: string[]
}

export interface LotteryResponse extends LotteryRoundGenerics {
  priceTicketInCake: SerializedBigNumber
  discountDivisor: SerializedBigNumber
  amountCollectedInCake: SerializedBigNumber
  cakePerBracket: SerializedBigNumber[]
  countWinnersPerBracket: SerializedBigNumber[]
  rewardsBreakdown: SerializedBigNumber[]
}

export interface LotteryState {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
  isTransitioning: boolean
  currentRound: LotteryResponse & { userTickets?: LotteryRoundUserTickets }
  lotteriesData?: LotteryRoundGraphEntity[]
  userLotteryData?: LotteryUserGraphEntity
}

export interface LotteryRoundGraphEntity {
  id: string
  totalUsers: string
  totalTickets: string
  winningTickets: string
  status: LotteryStatus
  finalNumber: string
  startTime: string
  endTime: string
  ticketPrice: SerializedBigNumber
}

export interface LotteryUserGraphEntity {
  account: string
  totalCake: string
  totalTickets: string
  rounds: UserRound[]
}

export interface UserRound {
  claimed: boolean
  lotteryId: string
  status: LotteryStatus
  endTime: string
  totalTickets: string
  tickets?: LotteryTicket[]
}

export type UserTicketsResponse = [ethers.BigNumber[], number[], boolean[]]

// Global state

export interface State {
  achievements: AchievementState
  block: BlockState
  farms: FarmsState
  pools: PoolsState
  predictions: PredictionsState
  profile: ProfileState
  teams: TeamsState
  collectibles: CollectiblesState
  voting: VotingState
  lottery: LotteryState
}
