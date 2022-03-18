import { useEffect, memo } from 'react'
import { useModal } from '@pancakeswap/uikit'
import DisclaimerModal from 'components/DisclaimerModal'
import { useUserLimitOrderAcceptedWarning } from 'state/user/hooks'

import { useTranslation } from 'contexts/Localization'

function ClaimWarning() {
  const { t } = useTranslation()
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserLimitOrderAcceptedWarning()

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
      onSuccess={() => setHasAcceptedRisk(true)}
    />,
    false,
    false,
  )

  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimer()
    }

    return () => {
      onDismiss()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAcceptedRisk])

  return null
}

export default memo(ClaimWarning)
