import { SpaceProps } from 'styled-system'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'

export type UserVote = {
  power: string
  locked?: boolean
}

export type RowProps = {
  data: GaugeVoting
  vote?: UserVote
  onChange: (value: MaxVote | UserVote) => void
} & SpaceProps

export type MaxVote = 'MAX_VOTE'
