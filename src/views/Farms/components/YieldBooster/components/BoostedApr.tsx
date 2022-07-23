import { RocketIcon, Text } from '@pancakeswap/uikit'
import { formatNumber } from 'utils/formatBalance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useBoostMultipler from '../hooks/useBoostMultipler'
import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'

export default function BoostedApr({ apr, farmPid, proxyPid, ...props }) {
  const boosterState = useYieldBoosterState({ farmPid, proxyPid })

  const multiplier = useBoostMultipler({ proxyPid, boosterState })

  const boostedApr =
    (!isUndefinedOrNull(multiplier) && !isUndefinedOrNull(apr) && formatNumber(apr * Number(multiplier))) || '0'

  const msg = boosterState === YieldBoosterState.ACTIVE ? `${boostedApr}%` : `Up to ${boostedApr}%`

  return (
    <>
      <RocketIcon m="4px" color="success" />
      <Text bold color="success" {...props}>
        {msg}
      </Text>
    </>
  )
}
