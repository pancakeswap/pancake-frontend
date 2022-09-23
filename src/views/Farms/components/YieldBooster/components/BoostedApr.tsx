import { useTranslation } from '@pancakeswap/localization'
import { RocketIcon, Text } from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { memo, useContext } from 'react'
import { formatNumber } from 'utils/formatBalance'
import useBoostMultiplier from '../hooks/useBoostMultiplier'
import useGetBoostedAPR from '../hooks/useGetBoostedAPR'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

interface BoostedAprPropsType {
  apr: number
  lpRewardsApr: number
  pid: number
  mr?: string
  userBalanceInFarm: BigNumber
  lpTotalSupply: BigNumber
}

function BoostedApr(props: BoostedAprPropsType) {
  const { lpRewardsApr, apr, pid, userBalanceInFarm, lpTotalSupply, ...rest } = props
  const { boosterState, proxyAddress } = useContext(YieldBoosterStateContext)
  const { t } = useTranslation()

  const boostedAprFromFE = useGetBoostedAPR(userBalanceInFarm, lpTotalSupply, apr, lpRewardsApr)

  const multiplier = useBoostMultiplier({ pid, boosterState, proxyAddress })

  const boostedAprFromSC =
    (!isUndefinedOrNull(multiplier) &&
      !isUndefinedOrNull(apr) &&
      formatNumber(
        _toNumber(apr) * Number(multiplier) + (!isUndefinedOrNull(lpRewardsApr) ? _toNumber(lpRewardsApr) : 0),
      )) ||
    '0'

  const msg =
    boosterState === YieldBoosterState.ACTIVE ? (
      `${boostedAprFromSC}%`
    ) : (
      <>
        <Text bold color="success" {...rest} fontSize={14} display="inline-block" mr="3px">
          {t('Up to')}
        </Text>
        {`${userBalanceInFarm.eq(0) ? boostedAprFromSC : boostedAprFromFE}%`}
      </>
    )
  // if (boostedAPR === '0') {
  //   return null
  // }

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
