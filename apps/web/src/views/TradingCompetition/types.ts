import { Profile } from 'state/types'
import { StaticImageData } from 'next/dist/client/image'

export interface CompetitionProps extends UserRewardsProps {
  userTradingInformation?: UserTradingInformation
  currentPhase?: CompetitionPhaseProps
  account?: string
  profile?: Profile
  isCompetitionLive?: boolean
  hasCompetitionEnded?: boolean
  userCanClaimPrizes?: boolean
  finishedAndPrizesClaimed?: boolean
  finishedAndNothingToClaim?: boolean
  isLoading?: boolean
  onDismiss?: () => void
  onRegisterSuccess?: () => void
  onClaimSuccess?: () => void
  coinDecoration?: React.ReactNode
}

export interface CompetitionStepProps {
  index?: number
  text?: string
}

export interface CompetitionPhaseProps {
  state?: string
  ends?: number | null
  step?: CompetitionStepProps
}

export interface CountdownProps {
  steps?: Array<{ text: string }>
  activeStepIndex?: number
  stepText?: string
  index?: number
}

interface LeaderboardData {
  total?: number
  volume?: number
  data?: LeaderboardDataItem[]
}

export interface LeaderboardDataItem {
  rank?: number
  address?: string
  volume?: number
  teamId?: number
}

export interface RibbonProps {
  ribbonDirection?: 'up' | 'down'
  ribbonText?: string
  isCardHeader?: boolean
  imageComponent?: React.ReactNode
  children?: React.ReactNode
}

export interface SectionProps {
  backgroundStyle?: string
  svgFill?: string
  index?: number
  intersectionPosition?: 'top' | 'bottom'
  intersectComponent?: React.ReactNode
  noIntersection?: boolean
}

export interface TeamLeaderboardProps {
  teamId?: number
  leaderboardData?: LeaderboardData
}

export interface TeamRanksProps {
  team1LeaderboardInformation?: TeamLeaderboardProps
  team2LeaderboardInformation?: TeamLeaderboardProps
  team3LeaderboardInformation?: TeamLeaderboardProps
  globalLeaderboardInformation?: LeaderboardData
  isGlobalLeaderboardDataComplete?: boolean
  image?: StaticImageData
}

export interface UserRewardsProps {
  userCanClaim?: boolean
  userRewards?: {
    cakeToClaim?: string
    pointsToClaim?: string
  }
}

export const initialUserLeaderboardInformation = {
  global: 0,
  team: 0,
  volume: 0,
  next_rank: 0,
  moboxVolumeRank: '???',
  moboxVolume: '???',
  darVolumeRank: '???',
  darVolume: '???',
}

export const initialUserTradingInformation = {
  isLoading: true,
  hasRegistered: false,
  isUserActive: false,
  hasUserClaimed: false,
  userRewardGroup: '0',
  userCakeRewards: '0',
  userMoboxRewards: '0',
  userDarRewards: '0',
  userPointReward: '0',
  canClaimMysteryBox: false,
  canClaimNFT: false,
}

export interface UserTradingInformation {
  isLoading: boolean
  account?: string
  hasRegistered?: boolean
  isUserActive?: boolean
  hasUserClaimed?: boolean
  userRewardGroup?: string
  userCakeRewards?: string
  userPointReward?: string
  userMoboxRewards?: string
  userDarRewards?: string
  canClaimMysteryBox?: boolean
  canClaimNFT?: boolean
}

export interface UserLeaderboardSharedInformation {
  global?: string | number
  team?: string | number
  volume?: number
  // eslint-disable-next-line camelcase
  next_rank?: number
}
export interface YourScoreProps extends CompetitionProps {
  hasRegistered?: boolean
  userLeaderboardInformation?: UserLeaderboardSharedInformation & {
    moboxVolumeRank?: string
    moboxVolume?: string
  }
}
