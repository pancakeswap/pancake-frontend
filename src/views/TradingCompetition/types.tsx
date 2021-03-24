import { Profile } from 'state/types'

export interface CompetitionProps {
  registered?: boolean
  account?: string
  profile: Profile
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
}

export interface CountdownProps {
  steps?: Array<string>
  activeStepIndex?: number
  stepText?: string
  index?: number
}
