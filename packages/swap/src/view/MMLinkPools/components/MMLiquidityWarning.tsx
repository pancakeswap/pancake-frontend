import { Alert } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export const MMLiquidityWarning: React.FC = () => {
  const { t } = useTranslation()
  return <Alert title={t('MMs are temporarily unable to facilitate trades. Please try again later')} variant="info" />
}
