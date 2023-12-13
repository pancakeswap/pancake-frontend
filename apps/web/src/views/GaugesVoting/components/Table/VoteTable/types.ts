import { Gauge } from '@pancakeswap/gauges'
import { SpaceProps } from 'styled-system'
import { Hex } from 'viem'

export type UserVote = {
  hash: Hex
  power: string
  locked?: boolean
}

export type RowProps = {
  data: Gauge
  vote?: UserVote
  onChange: (value: UserVote, isMax?: boolean) => void
} & SpaceProps

export const DEFAULT_VOTE: UserVote = {
  power: 'DEFAULT',
  locked: false,
  hash: '0x',
}
