import { useTranslation } from '@pancakeswap/localization'
import { RocketIcon, Text } from '@pancakeswap/uikit'
import _toNumber from 'lodash/toNumber'
import { memo, useContext } from 'react'
import { formatNumber } from 'utils/formatBalance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useBoostMultipler from '../hooks/useBoostMultipler'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

interface BoostedAprPropsType {
  apr: string
  pid: number
  mr?: string
}

function BoostedApr(props: BoostedAprPropsType) {
  const { apr, pid, ...rest } = props
  const { boosterState, proxyAddress } = useContext(YieldBoosterStateContext)
  const { t } = useTranslation()

  const multiplier = useBoostMultipler({ pid, boosterState, proxyAddress })

  const boostedApr =
    (!isUndefinedOrNull(multiplier) && !isUndefinedOrNull(apr) && formatNumber(_toNumber(apr) * Number(multiplier))) ||
    '0'

  const msg =
    boosterState === YieldBoosterState.ACTIVE ? (
      `${boostedApr}%`
    ) : (
      <>
        <Text bold color="success" {...rest} fontSize={14} display="inline-block" mr="3px">
          {t('Up to')}
        </Text>
        {`${boostedApr}%`}
      </>
    )

  return (
    <>
      <RocketIcon m="4px" color="success" />
      <Text bold color="success" {...rest} fontSize={16}>
        {msg}
      </Text>
    </>
  )
}

export default memo(BoostedApr)
