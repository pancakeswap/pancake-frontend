import { ReactText } from 'react'
import { Profile } from 'state/types'

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

export interface LeaderboardDataItem {
  rank?: number
  address?: string
  username?: string
  volume?: number
  teamId?: number
}

interface LeaderboardData {
  total?: number
  volume?: number
  data?: LeaderboardDataItem[]
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

export interface CompetitionProps extends UserRewardsProps {
  userTradingInformation?: UserTradingInformationProps
  account?: string
  profile?: Profile
  isCompetitionLive?: boolean
  hasCompetitionFinished?: boolean
  isLoading?: boolean
  onDismiss?: () => void
  onRegisterSuccess?: () => void
  onClaimSuccess?: () => void
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

export interface CountdownProps {
  steps?: Array<{ text: string; translationId: number }>
  activeStepIndex?: number
  stepText?: string
  index?: number
}
