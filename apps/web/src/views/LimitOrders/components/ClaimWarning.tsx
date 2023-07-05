import { useEffect, memo, useCallback } from 'react'
import { useModal } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'
import { useUserLimitOrderAcceptedWarning } from 'state/user/hooks'

import { useTranslation } from '@pancakeswap/localization'

function ClaimWarning() {
  const { t } = useTranslation()
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserLimitOrderAcceptedWarning()

  const handleSuccess = useCallback(() => {
    setHasAcceptedRisk(true)
  }, [setHasAcceptedRisk])

  const [onPresentRiskDisclaimer, onDismiss] = useModal(
    <DisclaimerModal
      id="disclaimer-limit-order"
      header={t('I acknowledge that:')}
      checks={[
        {
          key: 'price-checkbox',
          content: t('I understand that small orders are executed at higher execution price due to gas fees.'),
        },
        {
          key: 'taxtoken-checkbox',
          content: t(
            'I understand that using taxed tokens on limit orders is highly discouraged and not recommended - Taxed tokens can be stuck in limit orders and lost forever because of impossibility to execute an order for such tokens',
          ),
        },
      ]}
      onSuccess={handleSuccess}
    />,
    false,
  )

  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimer()
    }

    return onDismiss
  }, [hasAcceptedRisk, onDismiss, onPresentRiskDisclaimer])

  return null
}

export default memo(ClaimWarning)
