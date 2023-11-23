import { Percent } from '@pancakeswap/sdk'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useEffect, useMemo } from 'react'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { RowProps } from '../types'

export const useRowVoteState = ({ data, vote, onChange }: RowProps) => {
  const userVote = useUserVote(data)
  const voteLocked = userVote?.voteLocked
  const { balance: veCakeBalance } = useVeCakeBalance()
  const currentTimestamp = useCurrentBlockTimestamp()
  const epochVotePower = useEpochVotePower()
  // const nextEpochStart = useNextEpochStart()
  const currentVoteWeight = useMemo(() => {
    if (userVote?.slope && userVote?.power) {
      // @note: the real vote weight = slope * (end - nextEpochStart)
      // here we use slope * (end - nextEpochStart) for better ux show linearly dynamic change
      // const amount = getBalanceNumber(new BN(userVote.slope).times(userVote.end - nextEpochStart))
      const amount = getBalanceNumber(new BN(userVote.slope).times(userVote.end - currentTimestamp))
      if (amount === 0) return 0
      if (amount < 1) return amount.toPrecision(2)
      return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
    }
    return 0
  }, [currentTimestamp, userVote?.end, userVote?.power, userVote?.slope])

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
    // const powerBN = new BN(epochVotePower.toString())
    const amount = getBalanceNumber(veCakeBalance.times(p).div(10000))

    if (amount === 0) return 0
    if (amount < 1) return amount.toPrecision(2)
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [veCakeBalance, voteValue])

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
    willUnlock: epochVotePower === 0n && Boolean(userVote?.slope && userVote?.slope > 0),
  }
}
