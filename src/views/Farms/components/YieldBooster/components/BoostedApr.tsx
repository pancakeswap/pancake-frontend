import { memo, useContext } from 'react'
import { RocketIcon, Text } from '@pancakeswap/uikit'
import { formatNumber } from 'utils/formatBalance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useBoostMultipler from '../hooks/useBoostMultipler'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

function BoostedApr({ apr, proxyPid, ...props }) {
  const { boosterState } = useContext(YieldBoosterStateContext)

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

export default memo(BoostedApr)
