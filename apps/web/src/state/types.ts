import { SerializedFarmsState } from '@pancakeswap/farms'
import { SerializedPoolWithInfo } from '@pancakeswap/pools'
import { BetPosition, PredictionStatus, PredictionsChartView } from '@pancakeswap/prediction'
import BigNumber from 'bignumber.js'
import {
  CampaignType,
  LotteryStatus,
  LotteryTicket,
  TFetchStatus,
  Team,
  TranslatableText,
} from 'config/constants/types'
import { parseEther } from 'viem'
import { Address } from 'wagmi'
import { NftToken } from './nftMarket/types'

export enum GAS_PRICE {
  default = '1',
  fast = '4',
  instant = '5',
  testnet = '10',
}

export const GAS_PRICE_GWEI = {
  rpcDefault: 'rpcDefault',
  default: parseEther(GAS_PRICE.default, 'gwei').toString(),
  fast: parseEther(GAS_PRICE.fast, 'gwei').toString(),
  instant: parseEther(GAS_PRICE.instant, 'gwei').toString(),
  testnet: parseEther(GAS_PRICE.testnet, 'gwei').toString(),
}

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string

export enum VaultKey {
  CakeVaultV1 = 'cakeVaultV1',
  CakeVault = 'cakeVault',
  CakeFlexibleSideVault = 'cakeFlexibleSideVault',
  IfoPool = 'ifoPool',
}

export type SerializedPool = SerializedPoolWithInfo & {
  numberSecondsForUserLimit?: number
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  collectionAddress: Address
  tokenId: number
  isActive: boolean
  username: string
  nft?: NftToken
  team?: Team
  hasRegistered: boolean
}

// Slices states
export interface SerializedVaultFees {
  performanceFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface DeserializedVaultFees extends SerializedVaultFees {
  performanceFeeAsDecimal: number
}

export interface SerializedVaultUser {
  isLoading: boolean
  userShares: SerializedBigNumber
  cakeAtLastUserAction: SerializedBigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface SerializedLockedVaultUser extends SerializedVaultUser {
  lockStartTime: string
  lockEndTime: string
  userBoostedShare: SerializedBigNumber
  locked: boolean
  lockedAmount: SerializedBigNumber
  currentPerformanceFee: SerializedBigNumber
  currentOverdueFee: SerializedBigNumber
}

export interface DeserializedVaultUser {
  isLoading: boolean
  userShares: BigNumber
  cakeAtLastUserAction: BigNumber
  lastDepositedTime: string
  lastUserActionTime: string
  lockedAmount: BigNumber
  balance: {
    cakeAsNumberBalance: number
    cakeAsBigNumber: BigNumber
    cakeAsDisplayBalance: string
  }
}

export interface DeserializedLockedVaultUser extends DeserializedVaultUser {
  lastDepositedTime: string
  lastUserActionTime: string
  lockStartTime: string
  lockEndTime: string
  burnStartTime: string
  userBoostedShare: BigNumber
  locked: boolean
  lockedAmount: BigNumber
  currentPerformanceFee: BigNumber
  currentOverdueFee: BigNumber
}

export interface DeserializedCakeVault {
  totalShares?: BigNumber
  totalLockedAmount?: BigNumber
  pricePerFullShare?: BigNumber
  totalCakeInVault?: BigNumber
  fees?: DeserializedVaultFees
  userData?: DeserializedVaultUser
}

export interface DeserializedLockedCakeVault extends Omit<DeserializedCakeVault, 'userData'> {
  totalLockedAmount?: BigNumber
  userData?: DeserializedLockedVaultUser
}

export interface SerializedLockedCakeVault extends Omit<SerializedCakeVault, 'userData'> {
  totalLockedAmount?: SerializedBigNumber
  userData: SerializedLockedVaultUser
}

export interface SerializedCakeVault {
  totalShares?: SerializedBigNumber
  pricePerFullShare?: SerializedBigNumber
  totalCakeInVault?: SerializedBigNumber
  fees: SerializedVaultFees
  userData: SerializedVaultUser
}

// Ifo
export interface IfoState extends PublicIfoData {
  credit: string
}

export interface PublicIfoData {
  ceiling: string
}

export interface PoolsState {
  data: SerializedPool[]
  ifo: IfoState
  cakeVault: SerializedLockedCakeVault
  cakeFlexibleSideVault: SerializedCakeVault
  userDataLoaded: boolean
}

export type TeamsById = {
  [key: string]: Team
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

// Predictions

export interface Round {
  id: string
  epoch: number
  position: BetPosition
  failed: boolean
  startAt: number
  startBlock: number
  startHash: string
  lockAt: number
  lockBlock: number
  lockHash: string
  lockPrice: number
  lockRoundId: string
  closeAt: number
  closeBlock: number
  closeHash: string
  closePrice: number
  closeRoundId: string
  totalBets: number
  totalAmount: number
  bullBets: number
  bullAmount: number
  bearBets: number
  bearAmount: number
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
  claimedAt: number
  claimedBlock: number
  claimedHash: string
  claimedBNB: number
  claimedNetBNB: number
  createdAt: number
  updatedAt: number
  user?: PredictionUser
  round?: Round
}

export interface PredictionUser {
  id: string
  createdAt: number
  updatedAt: number
  block: number
  totalBets: number
  totalBetsBull: number
  totalBetsBear: number
  totalBNB: number
  totalBNBBull: number
  totalBNBBear: number
  totalBetsClaimed: number
  totalBNBClaimed: number
  winRate: number
  averageBNB: number
  netBNB: number
  bets?: Bet[]
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
  amount: string
  claimed: boolean
}

export interface NodeLedger {
  position: BetPosition
  amount: bigint
  claimed: boolean
}

export interface ReduxNodeRound {
  epoch: number
  startTimestamp: number | null
  lockTimestamp: number | null
  closeTimestamp: number | null
  lockPrice: string | null
  closePrice: string | null
  totalAmount: string
  bullAmount: string
  bearAmount: string
  rewardBaseCalAmount: string
  rewardAmount: string
  oracleCalled: boolean
  lockOracleId: string | null
  closeOracleId: string | null
}

export interface NodeRound {
  epoch: number
  startTimestamp: number | null
  lockTimestamp: number | null
  closeTimestamp: number | null
  lockPrice: bigint | null
  closePrice: bigint | null
  totalAmount: bigint | null
  bullAmount: bigint | null
  bearAmount: bigint | null
  rewardBaseCalAmount: bigint | null
  rewardAmount: bigint | null
  oracleCalled: boolean
  closeOracleId: string | null
  lockOracleId: string | null
}

export type LeaderboardFilterTimePeriod = '1d' | '7d' | '1m' | 'all'

export interface LeaderboardFilter {
  address?: null | string
  orderBy?: string
  timePeriod?: LeaderboardFilterTimePeriod
}

export interface PredictionsState {
  status: PredictionStatus
  isLoading: boolean
  isHistoryPaneOpen: boolean
  chartView: PredictionsChartView
  isChartPaneOpen: boolean
  isFetchingHistory: boolean
  historyFilter: HistoryFilter
  currentEpoch: number
  intervalSeconds: number
  minBetAmount: string
  bufferSeconds: number
  history: Bet[]
  totalHistory: number
  currentHistoryPage: number
  hasHistoryLoaded: boolean
  rounds?: RoundData
  ledgers?: LedgerData
  claimableStatuses: {
    [key: string]: boolean
  }
  leaderboard: {
    selectedAddress: null | string
    loadingState: TFetchStatus
    filters: LeaderboardFilter
    skip: number
    hasMoreResults: boolean
    addressResults: {
      [key: string]: null | PredictionUser
    }
    results: PredictionUser[]
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

export interface Proposal {
  author: string
  body: string
  choices: string[]
  end: number
  id: string
  snapshot: string
  votes: number
  start: number
  state: ProposalState
  title: string
}

export interface Vote {
  id: string
  voter: string
  created: number
  proposal: {
    choices: Proposal['choices']
  }
  choice: number
  metadata?: {
    votingPower: string
  }
  vp: number
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
  userLotteryData: LotteryUserGraphEntity
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

// Pottery
export interface PotteryState {
  lastVaultAddress: Address | null
  publicData: SerializedPotteryPublicData
  userData: SerializedPotteryUserData
  finishedRoundInfo: PotteryRoundInfo
}

export interface SerializedPotteryPublicData {
  lastDrawId: string
  totalPrize: string
  getStatus: PotteryDepositStatus
  totalLockCake: string
  totalSupply: string
  lockStartTime: string
  lockTime: number
  totalLockedValue: string
  latestRoundId: string
  maxTotalDeposit: string
}

export interface DeserializedPublicData {
  lastDrawId: string
  totalPrize: BigNumber
  getStatus: PotteryDepositStatus
  totalLockCake: BigNumber
  totalSupply: BigNumber
  lockStartTime: string
  lockTime: number
  totalLockedValue: BigNumber
  latestRoundId: string
  maxTotalDeposit: BigNumber
}

export interface SerializedPotteryUserData {
  isLoading?: boolean
  allowance: string
  previewDepositBalance: string
  stakingTokenBalance: string
  rewards: string
  winCount: string
  withdrawAbleData: PotteryWithdrawAbleData[]
}

export interface DeserializedPotteryUserData {
  isLoading?: boolean
  allowance: BigNumber
  previewDepositBalance: BigNumber
  stakingTokenBalance: BigNumber
  rewards: BigNumber
  winCount: string
  withdrawAbleData: PotteryWithdrawAbleData[]
}

export interface PotteryRoundInfo {
  isFetched: boolean
  roundId: string
  drawDate: string
  prizePot: string
  totalPlayers: string
  txid: string
  winners: Array<string>
  lockDate: string
}

export enum PotteryDepositStatus {
  BEFORE_LOCK = 0,
  LOCK = 1,
  UNLOCK = 2,
}

export interface PotteryWithdrawAbleData {
  id: string
  shares: string
  depositDate: string
  previewRedeem: string
  status: PotteryDepositStatus
  potteryVaultAddress: Address
  totalSupply: string
  totalLockCake: string
  lockedDate: string
  balanceOf: string
}

// Global state

export interface State {
  farms: SerializedFarmsState
  farmsV1: SerializedFarmsState
  pools: PoolsState
  predictions: PredictionsState
  lottery: LotteryState
  pottery: PotteryState
}
