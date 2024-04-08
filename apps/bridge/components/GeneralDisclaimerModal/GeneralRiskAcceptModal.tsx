import { useTranslation } from '@pancakeswap/localization'
import { useModal } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal/DisclaimerModal'
import { memo, useCallback, useEffect } from 'react'
import { useGetBridgeDisclaimerState } from 'state/useGetBridgeDisclaimerState'
import { BridgeDisclaimerConfig, BridgeIds } from './config'

function GeneralRiskAcceptModal({ bridgeConfig, cb }: { bridgeConfig: BridgeDisclaimerConfig; cb?: () => void }): null {
  const [hasAcceptedRisk, setHasAcceptedRisk] = useGetBridgeDisclaimerState(bridgeConfig.title)
  const { t } = useTranslation()

  const handleSuccess = useCallback(() => {
    cb?.()
    setHasAcceptedRisk(true)
  }, [setHasAcceptedRisk, cb])

  const [onPresentRiskDisclaimer, onDismiss] = useModal(
    <DisclaimerModal
      id={bridgeConfig.id}
      title={t(bridgeConfig.title)}
      header={t('This is an experimental product')}
      subtitle={t('We highly advise you go through the FAQ Guide below before continuing')}
      checks={[
        {
          key: 'responsibility-checkbox',
          content: t(
            'I understand that I am using this product at my own risk. Any losses incurred due to my actions are my own responsibility.',
          ),
        },
        bridgeConfig.title === BridgeIds.WORMHOLE
          ? {
              key: 'FAQ-checkbox',
              content: t('I have read the FAQ guide and am ready to continue.'),
            }
          : {
              key: 'beta-checkbox',
              content: t('I understand that this product is still in beta. I am participating at my own risk'),
            },
      ]}
      hasExternalLink={Boolean(bridgeConfig.title === BridgeIds.WORMHOLE)}
      onSuccess={handleSuccess}
    />,
    false,
  )

  useEffect(() => {
    if (typeof hasAcceptedRisk === 'boolean' && !hasAcceptedRisk) {
      onPresentRiskDisclaimer()
    } else onDismiss()
  }, [onDismiss, onPresentRiskDisclaimer, hasAcceptedRisk])

  return null
}

export default memo(GeneralRiskAcceptModal)
