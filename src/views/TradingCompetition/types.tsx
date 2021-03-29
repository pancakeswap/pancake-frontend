import { Profile } from 'state/types'

export interface CompetitionProps {
  registered?: boolean
  account?: string
  profile?: Profile
  isCompetitionLive?: boolean
  isLoading?: boolean
  isInitialized?: boolean
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
