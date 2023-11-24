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
    const { nativeSlope = 0n, nativeEnd = 0n, proxySlope = 0n, proxyEnd = 0n } = userVote || {}
    let nativeWeight = 0n
    let proxyWeight = 0n
    if (nativeSlope > 0n) {
      nativeWeight = nativeSlope * (nativeEnd - BigInt(currentTimestamp))
      nativeWeight = nativeWeight > 0n ? nativeWeight : 0n
    }
    if (proxySlope > 0n) {
      proxyWeight = proxySlope * (proxyEnd - BigInt(currentTimestamp))
      proxyWeight = proxyWeight > 0n ? proxyWeight : 0n
    }

    const amountInt = nativeWeight + proxyWeight

    const amount = getBalanceNumber(new BN(amountInt.toString()))
    if (amount === 0) return 0
    if (amount < 1) return amount.toPrecision(2)
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [currentTimestamp, userVote])

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
