import { useTranslation } from 'contexts/Localization'
import { ReactNode, useCallback } from 'react'

import _isEmpty from 'lodash/isEmpty'
import { NextLinkFromReactRouter } from 'components/NextLink'

import useYieldBoosterState, { YieldBoosterState } from '../hooks/useYieldBoosterState'
import useBoosterFarmHandlers from '../hooks/useBoosterFarmHandlers'

import useBoostMultipler from '../hooks/useBoostMultipler'
import ActionButton from './ActionButton'

interface BoostedActionPropsType {
  farmPid: number
  proxyPid: number
  title: (status: YieldBoosterState) => ReactNode
  desc: (actionBtn: ReactNode) => ReactNode
}

const BoostedAction: React.FunctionComponent<BoostedActionPropsType> = ({ farmPid, proxyPid, title, desc }) => {
  const { t } = useTranslation()
  const boosterState = useYieldBoosterState({ farmPid, proxyPid })
  const handlers = useBoosterFarmHandlers(farmPid)
  const boostMultipler = useBoostMultipler({ proxyPid, boosterState })

  const renderBtn = useCallback(() => {
    switch (boosterState) {
      case YieldBoosterState.UNCONNECTED:
        return (
          <ActionButton
            title={`Up to ${boostMultipler}x`}
            description={t('Connect wallet to activate yield booster')}
          />
        )
      case YieldBoosterState.NO_LOCKED:
        return (
          <ActionButton title={`Up to ${boostMultipler}x`} description={t('Lock CAKE to activate yield booster')}>
            <NextLinkFromReactRouter to="/pools">{t('Go to Pool')}</NextLinkFromReactRouter>
          </ActionButton>
        )
      case YieldBoosterState.NO_MIGRATE:
        return (
          <ActionButton
            onClick={() => {
              // open modal
            }}
            title={`${boostMultipler}x`}
            description={t('Migration required to activate boost')}
          >
            {t('Migrate')}
          </ActionButton>
        )
      case YieldBoosterState.NO_LP:
        return (
          <ActionButton title={`${boostMultipler}x`} description={t('Stake LP tokens to start boosting')} disabled>
            {t('Boost')}
          </ActionButton>
        )
      case YieldBoosterState.DEACTIVE:
        return (
          <ActionButton
            onClick={handlers.activate}
            title={`${boostMultipler}x`}
            description={t('Yield booster available')}
          >
            {t('Boost')}
          </ActionButton>
        )
      case YieldBoosterState.ACTIVE:
        return (
          <ActionButton onClick={handlers.deactivate} title={`${boostMultipler}x`} description={t('Active')}>
            {t('Unset')}
          </ActionButton>
        )
      case YieldBoosterState.MAX:
        return (
          <ActionButton title={`${boostMultipler}x`} description={t('Unset other boosters to activate')} disabled>
            {t('Boost')}
          </ActionButton>
        )
      default:
        return null
    }
  }, [boosterState, t, handlers.activate, handlers.deactivate, boostMultipler])

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
