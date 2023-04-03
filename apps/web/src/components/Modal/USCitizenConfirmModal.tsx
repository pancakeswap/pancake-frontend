import DisclaimerModal from 'components/DisclaimerModal'
import { useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { memo, useCallback } from 'react'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTheme } from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'

const USCitizenConfirmModal: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const [, setHasAcceptedRisk] = useUserNotUsCitizenAcknowledgement()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()

  const handleSuccess = useCallback(() => {
    setHasAcceptedRisk(true)
    const url = getPerpetualUrl({ chainId, languageCode: code, isDark })
    window.open(url, '_blank', 'noopener noreferrer')
    onDismiss?.()
  }, [setHasAcceptedRisk, chainId, code, isDark, onDismiss])

  return (
    <DisclaimerModal
      modalHeader={t('PancakeSwap Perpetuals')}
      id="disclaimer-perpetual-us-citizen"
      header={t(
        'To proceed to PancakeSwap Perpetuals Trading, please check the checkbox below to confirm that you are not a US citizen:',
      )}
      checks={[
        {
          key: 'checkbox',
          content: t('I confirm that I am not a US citizen and I am eligible to trade derivatives on this platform.'),
        },
      ]}
      footer={t('By proceeding, you agree to comply with all relevant laws and regulations.')}
      onSuccess={handleSuccess}
      onDismiss={onDismiss}
      headerStyle={{ fontWeight: 400, fontSize: 18 }}
      footerStyle={{ fontWeight: 600, fontSize: 18 }}
    />
  )
}

export default memo(USCitizenConfirmModal)
