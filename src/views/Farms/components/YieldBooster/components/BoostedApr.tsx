import { memo, useContext } from 'react'
import { RocketIcon, Text } from '@pancakeswap/uikit'
import { formatNumber } from 'utils/formatBalance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import _toNumber from 'lodash/toNumber'
import useBoostMultipler from '../hooks/useBoostMultipler'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

interface BoostedAprPropsType {
  apr: number
  pid: number
  mr?: string
}

function BoostedApr(props: BoostedAprPropsType) {
  const { apr, pid, ...rest } = props
  const { boosterState } = useContext(YieldBoosterStateContext)

  const multiplier = useBoostMultipler({ pid, boosterState })

  const boostedApr =
    (!isUndefinedOrNull(multiplier) && !isUndefinedOrNull(apr) && formatNumber(_toNumber(apr) * Number(multiplier))) ||
    '0'

  const msg = boosterState === YieldBoosterState.ACTIVE ? `${boostedApr}%` : `Up to ${boostedApr}%`

  return (
    <>
      <RocketIcon m="4px" color="success" />
      <Text bold color="success" {...rest} fontSize={14}>
        {msg}
      </Text>
    </>
  )
}

export default memo(BoostedApr)
