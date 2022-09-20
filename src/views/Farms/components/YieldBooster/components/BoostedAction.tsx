import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon } from '@pancakeswap/uikit'
import { ReactNode, useCallback, useContext } from 'react'

import { NextLinkFromReactRouter } from 'components/NextLink'

import BigNumber from 'bignumber.js'
import useBoosterFarmHandlers from '../hooks/useBoosterFarmHandlers'
import { useGetBoostedMultiplier } from '../hooks/useGetBoostedAPR'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'

import useBoostMultiplier from '../hooks/useBoostMultiplier'
import ActionButton from './ActionButton'
import CreateProxyButton from './CreateProxyButton'
import MigrateActionButton from './MigrateActionButton'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

interface BoostedActionPropsType {
  farmPid: number
  title: (status: YieldBoosterState) => ReactNode
  desc: (actionBtn: ReactNode) => ReactNode
  userBalanceInFarm: BigNumber
  lpTotalSupply: BigNumber
}

const BoostedAction: React.FunctionComponent<BoostedActionPropsType> = ({
  farmPid,
  title,
  desc,
  userBalanceInFarm,
  lpTotalSupply,
}) => {
  const { t } = useTranslation()
  const { boosterState, refreshActivePool, refreshProxyAddress, proxyAddress } = useContext(YieldBoosterStateContext)
  const { isConfirming, ...handlers } = useBoosterFarmHandlers(farmPid, refreshActivePool)
  const boostMultiplierFromSC = useBoostMultiplier({ pid: farmPid, boosterState, proxyAddress })
  const boostedMultiplierFromFE = useGetBoostedMultiplier(userBalanceInFarm, lpTotalSupply)
  const boostMultiplier = userBalanceInFarm.eq(0) ? boostMultiplierFromSC : boostedMultiplierFromFE
  const boostMultiplierDisplay = boostMultiplier.toLocaleString(undefined, { maximumFractionDigits: 3 })

  const renderBtn = useCallback(() => {
    switch (boosterState) {
      case YieldBoosterState.UNCONNECTED:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Connect wallet to activate yield booster')}
          />
        )
      case YieldBoosterState.NO_LOCKED:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Lock CAKE to activate yield booster')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <NextLinkFromReactRouter to="/pools">{t('Go to Pool')}</NextLinkFromReactRouter>
          </ActionButton>
        )
      case YieldBoosterState.LOCKED_END:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Lock CAKE is ended. Re-lock CAKE to activate yield booster')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <NextLinkFromReactRouter to="/pools">{t('Go to Pool')}</NextLinkFromReactRouter>
          </ActionButton>
        )
      case YieldBoosterState.NO_PROXY_CREATED:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('One-time setup is required for activating farm yield boosters')}
            button={<CreateProxyButton onDone={refreshProxyAddress} width="auto" />}
          />
        )
      case YieldBoosterState.NO_MIGRATE:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Migration required to activate boost')}
            button={<MigrateActionButton pid={farmPid} />}
          />
        )
      case YieldBoosterState.NO_LP:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Stake LP tokens to start boosting')}
            disabled
          >
            {t('Boost')}
          </ActionButton>
        )
      case YieldBoosterState.DEACTIVE:
        return (
          <ActionButton
            disabled={isConfirming}
            onClick={handlers.activate}
            title={`${boostMultiplierDisplay}x`}
            isLoading={isConfirming}
            description={t('Yield booster available')}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            {t('Boost')}
          </ActionButton>
        )
      case YieldBoosterState.ACTIVE:
        return (
          <ActionButton
            disabled={isConfirming}
            onClick={handlers.deactivate}
            title={`${boostMultiplierDisplay}x`}
            isLoading={isConfirming}
            description={t('Active')}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            {t('Unset')}
          </ActionButton>
        )
      case YieldBoosterState.MAX:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Unset other boosters to activate')}
            disabled
          >
            {t('Boost')}
          </ActionButton>
        )
      default:
        return null
    }
  }, [
    boosterState,
    t,
    handlers.activate,
    handlers.deactivate,
    isConfirming,
    farmPid,
    refreshProxyAddress,
    boostMultiplierDisplay,
  ])

  let status = null

  if ([YieldBoosterState.NO_MIGRATE, YieldBoosterState.DEACTIVE].includes(boosterState)) {
    status = t('Ready')
  } else if (boosterState === YieldBoosterState.ACTIVE) {
    status = t('Active')
  }

  return (
    <>
      {title && title(status)}
      {desc && desc(renderBtn())}
    </>
  )
}

export default BoostedAction
