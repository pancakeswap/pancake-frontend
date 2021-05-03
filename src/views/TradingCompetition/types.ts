import { ReactText } from 'react'
import { Profile } from 'state/types'

export interface CompetitionProps extends UserRewardsProps {
  userTradingInformation?: UserTradingInformationProps
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
}

export interface UserRewardsProps {
  userCanClaim?: boolean
  userRewards?: {
    cakeToClaim?: string
    pointsToClaim?: string
  }
}

export interface UserTradingInformationProps {
  hasRegistered?: boolean
  hasUserClaimed?: boolean
  userRewardGroup?: string
  userCakeRewards?: string
  userPointReward?: string
  canClaimNFT?: boolean
}

export interface YourScoreProps extends CompetitionProps {
  hasRegistered?: boolean
  userLeaderboardInformation?: {
    global?: ReactText
    team?: ReactText
    volume?: number
    // eslint-disable-next-line camelcase
    next_rank?: number
  }
}
