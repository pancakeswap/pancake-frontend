import { Profile } from 'state/types'

export interface UserTradingStatsProps {
  0?: string
  1?: string
  2?: boolean
  3?: boolean
  rewardGroup?: string
  teamId?: string
  hasRegistered?: boolean
  hasClaimed?: boolean
}

export interface CompetitionProps {
  userTradingStats?: UserTradingStatsProps
  account?: string
  profile?: Profile
  isCompetitionLive?: boolean
  isLoading?: boolean
  onDismiss?: () => void
}

export interface YourScoreProps extends CompetitionProps {
  test?: boolean
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
