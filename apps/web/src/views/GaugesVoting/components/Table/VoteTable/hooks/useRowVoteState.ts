import { Percent } from '@pancakeswap/sdk'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useNextEpochStart } from 'views/GaugesVoting/hooks/useEpochTime'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { RowProps } from '../types'

export const useRowVoteState = ({ data, vote, onChange }: RowProps) => {
  const userVote = useUserVote(data)
  const voteLocked = userVote?.voteLocked
  const epochVotePower = useEpochVotePower()
  const nextEpochStart = useNextEpochStart()
  const currentVoteWeight = useMemo(() => {
    if (userVote?.slope && userVote?.power && userVote?.end > nextEpochStart) {
      const amount = getBalanceNumber(new BN(userVote.slope).times(userVote.end - nextEpochStart))
      if (amount < 1) return amount.toPrecision(2)
      return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
    }
    return 0
  }, [nextEpochStart, userVote?.end, userVote?.power, userVote?.slope])

  const currentVotePercent = useMemo(() => {
    return userVote?.power && Number(currentVoteWeight) > 0
      ? new Percent(userVote?.power, 10000).toSignificant(2)
      : undefined
  }, [currentVoteWeight, userVote?.power])

  const voteValue = useMemo(() => {
    if (voteLocked) return currentVotePercent ?? ''
    return vote?.power ?? ''
  }, [voteLocked, currentVotePercent, vote?.power])

  const previewVoteWeight = useMemo(() => {
    const p = Number(voteValue || 0) * 100
    const powerBN = new BN(epochVotePower.toString())
    const amount = getBalanceNumber(powerBN.times(p).div(10000))

    if (amount === 0) return 0
    if (amount < 1) return amount.toPrecision(2)
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [epochVotePower, voteValue])

  // reinit vote value if user vote locked
  useEffect(() => {
    if (voteLocked && !vote) {
      onChange({
        power: voteValue,
        locked: true,
      })
    }
  }, [onChange, vote, voteLocked, voteValue])

  return {
    currentVoteWeight,
    currentVotePercent,
    previewVoteWeight,
    voteValue,
    voteLocked,
  }
}
