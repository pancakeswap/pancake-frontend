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
  imageComponent?: React.ReactNode
  children?: React.ReactNode
}
