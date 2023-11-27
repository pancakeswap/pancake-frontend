import { SpaceProps } from 'styled-system'
import { Hex } from 'viem'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'

export type UserVote = {
  hash: Hex
  power: string
  locked?: boolean
}

export type RowProps = {
  data: GaugeVoting
  vote?: UserVote
  onChange: (value: UserVote, isMax?: boolean) => void
} & SpaceProps

export const DEFAULT_VOTE: UserVote = {
  power: '0',
  locked: false,
  hash: '0x',
}
